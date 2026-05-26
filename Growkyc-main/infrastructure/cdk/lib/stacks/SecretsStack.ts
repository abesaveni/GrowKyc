import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { APP_NAME, ENV, SECRETS_PREFIX } from '../config';

interface SecretsStackProps extends cdk.StackProps {
  secretsKmsKey: kms.Key;
}

export class SecretsStack extends cdk.Stack {
  public readonly appJwtSecret: secretsmanager.Secret;
  public readonly integrationSecrets: secretsmanager.Secret;

  constructor(scope: Construct, id: string, props: SecretsStackProps) {
    super(scope, id, props);

    const { secretsKmsKey } = props;

    // App-level signing key and fallback crypto material.
    this.appJwtSecret = new secretsmanager.Secret(this, 'AppJwtSecret', {
      secretName: `${SECRETS_PREFIX}/app-jwt-signing-key`,
      description: `GrowKYC ${ENV} JWT signing key material`,
      encryptionKey: secretsKmsKey,
      generateSecretString: {
        passwordLength: 64,
        excludeCharacters: '"@/\\\' ',
      },
    });

    // Placeholder map for provider API keys (GreenID, sanctions, PEP, etc.).
    this.integrationSecrets = new secretsmanager.Secret(this, 'IntegrationSecrets', {
      secretName: `${SECRETS_PREFIX}/integration-keys`,
      description: `GrowKYC ${ENV} third-party integration credentials`,
      encryptionKey: secretsKmsKey,
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          greenIdApiKey: 'set-in-secrets-manager',
          sanctionsApiKey: 'set-in-secrets-manager',
          pepApiKey: 'set-in-secrets-manager',
          adverseMediaApiKey: 'set-in-secrets-manager',
        }),
        generateStringKey: 'rotationToken',
        passwordLength: 40,
      },
    });

    new cdk.CfnOutput(this, 'AppJwtSecretArn', {
      value: this.appJwtSecret.secretArn,
      exportName: `${id}-AppJwtSecretArn`,
    });

    new cdk.CfnOutput(this, 'IntegrationSecretsArn', {
      value: this.integrationSecrets.secretArn,
      exportName: `${id}-IntegrationSecretsArn`,
    });
  }
}
