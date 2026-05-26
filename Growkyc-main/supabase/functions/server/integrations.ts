// Backend API Routes for Integrations
// This file would be deployed to /supabase/functions/server/integrations.ts

import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';

const app = new Hono();

app.use('*', cors());

// ==========================================
// XERO API INTEGRATION
// ==========================================

app.post('/api/integrations/xero/connect', async (c) => {
  try {
    const { authCode } = await c.req.json();
    
    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://identity.xero.com/connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${Deno.env.get('XERO_CLIENT_ID')}:${Deno.env.get('XERO_CLIENT_SECRET')}`)}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: Deno.env.get('XERO_REDIRECT_URI') || ''
      })
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange auth code for tokens');
    }

    const tokens = await tokenResponse.json();

    return c.json({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in
    });
  } catch (error) {
    console.error('Xero connection error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post('/api/integrations/xero/contacts', async (c) => {
  try {
    const contactData = await c.req.json();
    const token = c.req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get tenant ID
    const connectionsResponse = await fetch('https://api.xero.com/connections', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const connections = await connectionsResponse.json();
    const tenantId = connections[0]?.tenantId;

    if (!tenantId) {
      throw new Error('No Xero organization found');
    }

    // Create contact
    const response = await fetch('https://api.xero.com/api.xro/2.0/Contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Xero-tenant-id': tenantId,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ Contacts: [contactData] })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Xero API error: ${error}`);
    }

    const data = await response.json();
    return c.json(data.Contacts[0]);
  } catch (error) {
    console.error('Xero create contact error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.get('/api/integrations/xero/contacts/:id', async (c) => {
  try {
    const contactId = c.req.param('id');
    const token = c.req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get tenant ID
    const connectionsResponse = await fetch('https://api.xero.com/connections', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const connections = await connectionsResponse.json();
    const tenantId = connections[0]?.tenantId;

    // Get contact
    const response = await fetch(`https://api.xero.com/api.xro/2.0/Contacts/${contactId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Xero-tenant-id': tenantId
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Xero contact');
    }

    const data = await response.json();
    return c.json(data.Contacts[0]);
  } catch (error) {
    console.error('Xero fetch contact error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ==========================================
// ASIC API INTEGRATION
// ==========================================

app.post('/api/integrations/asic/lookup', async (c) => {
  try {
    const { acn } = await c.req.json();
    
    // Call ASIC API (or InfoTrack which provides ASIC data)
    const response = await fetch('https://api.infotrack.com.au/v2/asic/company-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('INFOTRACK_API_KEY')}`
      },
      body: JSON.stringify({ acn })
    });

    if (!response.ok) {
      throw new Error('ASIC lookup failed');
    }

    const data = await response.json();
    
    return c.json({
      acn: data.acn,
      abn: data.abn,
      name: data.organisationName,
      status: data.registrationStatus,
      type: data.companyType,
      registrationDate: data.registrationDate,
      registeredAddress: data.registeredOfficeAddress,
      directors: data.currentDirectors?.map((d: any) => ({
        name: d.givenNames + ' ' + d.familyName,
        dateOfBirth: d.dateOfBirth,
        address: d.residentialAddress,
        appointmentDate: d.appointmentDate
      })) || [],
      shareholders: data.shareholders?.map((s: any) => ({
        name: s.name,
        shares: s.sharesHeld,
        percentage: s.percentageHeld
      })) || []
    });
  } catch (error) {
    console.error('ASIC lookup error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post('/api/integrations/asic/directors', async (c) => {
  try {
    const { acn } = await c.req.json();
    
    const response = await fetch('https://api.infotrack.com.au/v2/asic/current-directors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('INFOTRACK_API_KEY')}`
      },
      body: JSON.stringify({ acn })
    });

    if (!response.ok) {
      throw new Error('Director lookup failed');
    }

    const data = await response.json();
    
    return c.json({
      directors: data.directors?.map((d: any) => ({
        name: d.givenNames + ' ' + d.familyName,
        dateOfBirth: d.dateOfBirth,
        address: d.residentialAddress,
        appointmentDate: d.appointmentDate
      })) || []
    });
  } catch (error) {
    console.error('ASIC director lookup error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ==========================================
// BGL (Simple Fund 360) INTEGRATION
// ==========================================

app.post('/api/integrations/bgl/connect', async (c) => {
  try {
    const { apiKey, clientId } = await c.req.json();
    
    // Validate BGL credentials
    const response = await fetch('https://api.bglcorp.com/sf360/v1/auth/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify({ clientId })
    });

    if (!response.ok) {
      throw new Error('BGL authentication failed');
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('BGL connection error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post('/api/integrations/bgl/funds', async (c) => {
  try {
    const fundData = await c.req.json();
    const apiKey = c.req.header('X-API-Key');

    if (!apiKey) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Create SMSF in BGL
    const response = await fetch('https://api.bglcorp.com/sf360/v1/funds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify({
        fundName: fundData.fundName,
        abn: fundData.abn,
        tfn: fundData.tfn,
        trusteeType: fundData.trusteeType,
        status: 'Active'
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`BGL API error: ${error}`);
    }

    const data = await response.json();
    
    return c.json({
      fundName: data.fundName,
      abn: data.abn,
      tfn: data.tfn,
      members: data.members || [],
      trustees: data.trustees || [],
      assets: data.totalAssets || 0
    });
  } catch (error) {
    console.error('BGL create fund error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.get('/api/integrations/bgl/funds/:abn', async (c) => {
  try {
    const abn = c.req.param('abn');
    const apiKey = c.req.header('X-API-Key');

    if (!apiKey) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const response = await fetch(`https://api.bglcorp.com/sf360/v1/funds/${abn}`, {
      headers: {
        'X-API-Key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch BGL fund');
    }

    const data = await response.json();
    
    return c.json({
      fundName: data.fundName,
      abn: data.abn,
      tfn: data.tfn,
      members: data.members || [],
      trustees: data.trustees || [],
      assets: data.totalAssets || 0
    });
  } catch (error) {
    console.error('BGL fetch fund error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ==========================================
// ATO API INTEGRATION
// ==========================================

app.post('/api/integrations/ato/lookup', async (c) => {
  try {
    const { abn } = await c.req.json();
    
    // Call ABN Lookup API
    const response = await fetch(`https://abr.business.gov.au/json/AbnDetails.aspx?abn=${abn}&guid=${Deno.env.get('ABR_GUID')}`);

    if (!response.ok) {
      throw new Error('ATO lookup failed');
    }

    const data = await response.json();
    
    return c.json({
      abn: data.Abn,
      abnStatus: data.AbnStatus,
      entityName: data.EntityName,
      entityType: data.EntityTypeName,
      gstRegistered: data.Gst !== null,
      gstFromDate: data.Gst?.EffectiveFrom
    });
  } catch (error) {
    console.error('ATO lookup error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post('/api/integrations/ato/verify-tfn', async (c) => {
  try {
    const { tfn, name } = await c.req.json();
    
    // TFN verification through secure ATO channel
    // Note: Real TFN verification requires special ATO access
    const response = await fetch('https://api.ato.gov.au/tfn/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('ATO_API_KEY')}`
      },
      body: JSON.stringify({ tfn, name })
    });

    if (!response.ok) {
      throw new Error('TFN verification failed');
    }

    const data = await response.json();
    
    return c.json({
      verified: data.verified,
      name: data.name
    });
  } catch (error) {
    console.error('ATO TFN verification error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ==========================================
// STRIPE PAYMENT GATEWAY
// ==========================================

app.post('/api/payments/stripe/charge', async (c) => {
  try {
    const { amount, currency, description, cardToken } = await c.req.json();
    
    const response = await fetch('https://api.stripe.com/v1/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${Deno.env.get('STRIPE_SECRET_KEY')}`
      },
      body: new URLSearchParams({
        amount: (amount * 100).toString(), // Convert to cents
        currency: currency || 'aud',
        description: description,
        source: cardToken
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Payment failed');
    }

    const data = await response.json();
    
    return c.json({
      success: true,
      transactionId: data.id,
      amount: data.amount / 100,
      currency: data.currency,
      status: data.status
    });
  } catch (error) {
    console.error('Stripe charge error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post('/api/payments/stripe/direct-debit', async (c) => {
  try {
    const { name, email, bsbNumber, accountNumber } = await c.req.json();
    
    // Create customer
    const customerResponse = await fetch('https://api.stripe.com/v1/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${Deno.env.get('STRIPE_SECRET_KEY')}`
      },
      body: new URLSearchParams({
        name: name,
        email: email
      })
    });

    if (!customerResponse.ok) {
      throw new Error('Failed to create customer');
    }

    const customer = await customerResponse.json();

    // Create AU BECS Debit payment method
    const paymentMethodResponse = await fetch('https://api.stripe.com/v1/payment_methods', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${Deno.env.get('STRIPE_SECRET_KEY')}`
      },
      body: new URLSearchParams({
        type: 'au_becs_debit',
        'au_becs_debit[bsb_number]': bsbNumber,
        'au_becs_debit[account_number]': accountNumber
      })
    });

    if (!paymentMethodResponse.ok) {
      throw new Error('Failed to create payment method');
    }

    const paymentMethod = await paymentMethodResponse.json();

    // Attach payment method to customer
    await fetch(`https://api.stripe.com/v1/payment_methods/${paymentMethod.id}/attach`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${Deno.env.get('STRIPE_SECRET_KEY')}`
      },
      body: new URLSearchParams({
        customer: customer.id
      })
    });

    return c.json({
      success: true,
      customerId: customer.id,
      paymentMethodId: paymentMethod.id
    });
  } catch (error) {
    console.error('Stripe direct debit error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ==========================================
// PAYPAL INTEGRATION
// ==========================================

app.post('/api/payments/paypal/subscription', async (c) => {
  try {
    const { planId, customerEmail, returnUrl, cancelUrl } = await c.req.json();
    
    // Get PayPal access token
    const authResponse = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${Deno.env.get('PAYPAL_CLIENT_ID')}:${Deno.env.get('PAYPAL_CLIENT_SECRET')}`)}`
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials'
      })
    });

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    // Create subscription
    const subscriptionResponse = await fetch('https://api-m.paypal.com/v1/billing/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        plan_id: planId,
        subscriber: {
          email_address: customerEmail
        },
        application_context: {
          return_url: returnUrl,
          cancel_url: cancelUrl,
          brand_name: 'Professional Services',
          user_action: 'SUBSCRIBE_NOW'
        }
      })
    });

    if (!subscriptionResponse.ok) {
      const error = await subscriptionResponse.json();
      throw new Error(error.message || 'PayPal subscription failed');
    }

    const subscription = await subscriptionResponse.json();
    const approvalUrl = subscription.links.find((link: any) => link.rel === 'approve')?.href;

    return c.json({
      success: true,
      subscriptionId: subscription.id,
      approvalUrl: approvalUrl,
      status: subscription.status
    });
  } catch (error) {
    console.error('PayPal subscription error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ==========================================
// WEBHOOKS
// ==========================================

// Xero webhook
app.post('/webhooks/xero', async (c) => {
  try {
    const signature = c.req.header('x-xero-signature');
    const payload = await c.req.text();

    // Verify webhook signature
    const crypto = await import('node:crypto');
    const hmac = crypto.createHmac('sha256', Deno.env.get('XERO_WEBHOOK_KEY') || '');
    const calculatedSignature = hmac.update(payload).digest('base64');

    if (signature !== calculatedSignature) {
      return c.json({ error: 'Invalid signature' }, 401);
    }

    const events = JSON.parse(payload);
    
    // Process webhook events
    for (const event of events.events) {
      console.log('Xero webhook event:', event);
      // Handle contact updates, invoice changes, etc.
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Xero webhook error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Stripe webhook
app.post('/webhooks/stripe', async (c) => {
  try {
    const signature = c.req.header('stripe-signature');
    const payload = await c.req.text();

    // Verify webhook signature
    const stripe = await import('npm:stripe');
    const stripeClient = new stripe.default(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16'
    });

    const event = stripeClient.webhooks.constructEvent(
      payload,
      signature || '',
      Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    );

    // Handle event
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object);
        break;
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object);
        break;
      case 'customer.subscription.created':
        console.log('Subscription created:', event.data.object);
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }

    return c.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);
