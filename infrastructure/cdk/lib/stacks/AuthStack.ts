import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { APP_NAME, ENV, SECRETS_PREFIX } from '../config';

export class AuthStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;
  public readonly identityPool: cognito.CfnIdentityPool;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // -------------------------------------------------------
    // Cognito User Pool — bank-grade configuration
    // -------------------------------------------------------
    this.userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: `growkyc-${ENV}-users`,

      // Sign-in options
      signInAliases: {
        email: true,
        username: false,
        phone: false,
      },
      autoVerify: { email: true },
      caseSensitive: false,

      // Bank-grade password policy
      passwordPolicy: {
        minLength: 14,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
        tempPasswordValidity: cdk.Duration.days(1),
      },

      // MFA — REQUIRED for all users (mandatory TOTP)
      mfa: cognito.Mfa.REQUIRED,
      mfaSecondFactor: {
        sms: false,   // SMS MFA is phishable; TOTP only
        otp: true,    // TOTP (Google Authenticator, Authy, etc.)
      },

      // Account recovery via email only (no SMS recovery)
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,

      // User attributes — standard
      standardAttributes: {
        email: { required: true, mutable: false },
        givenName: { required: true, mutable: true },
        familyName: { required: true, mutable: true },
        phoneNumber: { required: false, mutable: true },
      },

      // Custom attributes for RBAC
      customAttributes: {
        organizationId: new cognito.StringAttribute({ mutable: true }),
        role: new cognito.StringAttribute({ mutable: true }),
        permissions: new cognito.StringAttribute({ mutable: true, maxLen: 2048 }),
      },

      // Advanced Security Mode — risk-based MFA challenges
      advancedSecurityMode: cognito.AdvancedSecurityMode.ENFORCED,

      // User verification email
      userVerification: {
        emailSubject: 'Verify your GrowKYC account',
        emailBody: 'Your verification code is {####}. This code expires in 24 hours.',
        emailStyle: cognito.VerificationEmailStyle.CODE,
      },

      // User invitation email
      userInvitation: {
        emailSubject: 'You have been invited to GrowKYC',
        emailBody: 'Your temporary password is {####}. You must set up MFA on first login.',
      },

      // Email configuration (update with SES in production)
      email: cognito.UserPoolEmail.withCognito(),

      // Device tracking — remember trusted devices
      deviceTracking: {
        challengeRequiredOnNewDevice: true,
        deviceOnlyRememberedOnUserPrompt: true,
      },

      // Token validity — short-lived access tokens
      signInCaseSensitive: false,

      // Deletion protection
      deletionProtection: ENV === 'prod',

      removalPolicy: ENV === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    // -------------------------------------------------------
    // User Groups — map to RBAC roles
    // -------------------------------------------------------
    const groups: Array<{ name: string; description: string; precedence: number }> = [
      { name: 'super_admin', description: 'Full platform access', precedence: 1 },
      { name: 'admin', description: 'Organisation-level admin', precedence: 10 },
      { name: 'manager', description: 'Department-level management', precedence: 20 },
      { name: 'user', description: 'Standard end user', precedence: 30 },
      { name: 'client', description: 'API client / external', precedence: 40 },
    ];

    for (const g of groups) {
      new cognito.CfnUserPoolGroup(this, `Group${g.name}`, {
        userPoolId: this.userPool.userPoolId,
        groupName: g.name,
        description: g.description,
        precedence: g.precedence,
      });
    }

    // -------------------------------------------------------
    // App Client — SPA (no client secret, PKCE flow)
    // -------------------------------------------------------
    this.userPoolClient = this.userPool.addClient('SpaClient', {
      userPoolClientName: `growkyc-${ENV}-spa`,
      generateSecret: false, // No secret for browser SPA
      authFlows: {
        userPassword: false,        // Do not allow direct password flow from SPA
        userSrp: true,              // SRP flow — safe for browser
        adminUserPassword: false,   // Admin flow only from Lambda backend
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true, // PKCE only
          implicitCodeGrant: false,     // Deprecated, insecure — disabled
        },
        scopes: [
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.PROFILE,
        ],
        callbackUrls: [
          `https://app.growkyc.com.au/auth/callback`,
          `http://localhost:5173/auth/callback`, // Dev only
        ],
        logoutUrls: [
          `https://app.growkyc.com.au/`,
          `http://localhost:5173/`,
        ],
      },
      // Short token validity for compliance
      accessTokenValidity: cdk.Duration.minutes(60),
      idTokenValidity: cdk.Duration.minutes(60),
      refreshTokenValidity: cdk.Duration.days(30),
      enableTokenRevocation: true,
      preventUserExistenceErrors: true,
    });

    // -------------------------------------------------------
    // Identity Pool — exchange Cognito tokens for AWS credentials
    // (needed for direct S3 presigned URL generation from Lambda)
    // -------------------------------------------------------
    this.identityPool = new cognito.CfnIdentityPool(this, 'IdentityPool', {
      identityPoolName: `growkyc_${ENV}_identity`,
      allowUnauthenticatedIdentities: false, // No unauthenticated access
      cognitoIdentityProviders: [
        {
          clientId: this.userPoolClient.userPoolClientId,
          providerName: this.userPool.userPoolProviderName,
          serverSideTokenCheck: true,
        },
      ],
    });

    // Authenticated role — read access to own S3 prefixes
    const authenticatedRole = new iam.Role(this, 'CognitoAuthenticatedRole', {
      roleName: `growkyc-${ENV}-cognito-authenticated`,
      description: 'IAM role for authenticated Cognito users',
      assumedBy: new iam.FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: {
            'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'authenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity',
      ),
    });

    // Authenticated users cannot access S3 directly — all access via Lambda API
    // (this role is intentionally minimal)
    authenticatedRole.addToPolicy(new iam.PolicyStatement({
      sid: 'NoDirectS3Access',
      effect: iam.Effect.DENY,
      actions: ['s3:*'],
      resources: ['*'],
    }));

    // Attach roles to identity pool
    new cognito.CfnIdentityPoolRoleAttachment(this, 'IdentityPoolRoles', {
      identityPoolId: this.identityPool.ref,
      roles: {
        authenticated: authenticatedRole.roleArn,
      },
    });

    // -------------------------------------------------------
    // Outputs
    // -------------------------------------------------------
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: this.userPool.userPoolId,
      exportName: `${id}-UserPoolId`,
    });
    new cdk.CfnOutput(this, 'UserPoolArn', {
      value: this.userPool.userPoolArn,
      exportName: `${id}-UserPoolArn`,
    });
    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: this.userPoolClient.userPoolClientId,
      exportName: `${id}-UserPoolClientId`,
    });
    new cdk.CfnOutput(this, 'IdentityPoolId', {
      value: this.identityPool.ref,
      exportName: `${id}-IdentityPoolId`,
    });
    new cdk.CfnOutput(this, 'UserPoolDomain', {
      value: `cognito-idp.${this.region}.amazonaws.com/${this.userPool.userPoolId}`,
      exportName: `${id}-UserPoolDomain`,
    });
  }
}
