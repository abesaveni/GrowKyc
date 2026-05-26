// PEXA API Endpoints
// Add these endpoints to index.tsx before // ==================== ERROR HANDLING ====================

// ==================== PEXA API ENDPOINTS ====================

// Initialize PEXA service
const pexaService = new PEXAService('sandbox'); // Change to 'production' when ready

// Get PEXA workspace details
app.get("/make-server-b186a255/pexa/workspace/:workspaceId", async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    
    if (!workspaceId) {
      return c.json({ error: 'Workspace ID required' }, 400);
    }

    const workspace = await pexaService.getWorkspace(workspaceId);
    
    // Store workspace in KV for caching
    await kv.set(`pexa_workspace:${workspaceId}`, workspace);

    console.log(`Retrieved PEXA workspace: ${workspaceId}`);
    
    return c.json({
      success: true,
      workspace
    });
    
  } catch (error) {
    console.error('PEXA workspace retrieval error:', error);
    
    // If PEXA credentials not configured, return cached data or mock
    const workspaceId = c.req.param('workspaceId');
    const cachedWorkspace = await kv.get(`pexa_workspace:${workspaceId}`);
    
    if (cachedWorkspace) {
      return c.json({
        success: true,
        workspace: cachedWorkspace,
        cached: true
      });
    }
    
    return c.json({ 
      error: `Failed to retrieve workspace: ${error.message}`,
      message: 'PEXA API credentials may not be configured'
    }, error.message.includes('credentials') ? 503 : 500);
  }
});

// Create new PEXA workspace from case data
app.post("/make-server-b186a255/pexa/workspace/create", async (c) => {
  try {
    const body = await c.req.json();
    const { caseData } = body;
    
    if (!caseData) {
      return c.json({ error: 'Case data required' }, 400);
    }

    // Map case data to PEXA workspace format
    const workspaceData = pexaService.mapCaseDataToPEXAWorkspace(caseData);
    
    // Create workspace in PEXA
    const workspace = await pexaService.createWorkspace(workspaceData);
    
    // Store workspace mapping
    await kv.set(`pexa_workspace:${workspace.workspaceId}`, workspace);
    await kv.set(`case_pexa_mapping:${caseData.caseId}`, {
      caseId: caseData.caseId,
      workspaceId: workspace.workspaceId,
      createdAt: new Date().toISOString()
    });

    console.log(`Created PEXA workspace: ${workspace.workspaceId} for case: ${caseData.caseId}`);
    
    return c.json({
      success: true,
      workspace,
      message: 'PEXA workspace created successfully'
    });
    
  } catch (error) {
    console.error('PEXA workspace creation error:', error);
    return c.json({ 
      error: `Failed to create workspace: ${error.message}`,
      message: 'Please check PEXA API credentials and case data'
    }, 500);
  }
});

// Sync case data with PEXA workspace
app.post("/make-server-b186a255/pexa/workspace/:workspaceId/sync", async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    const body = await c.req.json();
    const { caseData } = body;
    
    if (!workspaceId || !caseData) {
      return c.json({ error: 'Workspace ID and case data required' }, 400);
    }

    // Pull latest data from PEXA
    const workspace = await pexaService.getWorkspace(workspaceId);
    const financialSettlement = await pexaService.getFinancialSettlement(workspaceId);
    const tasks = await pexaService.getWorkspaceTasks(workspaceId);
    const documents = await pexaService.getWorkspaceDocuments(workspaceId);
    
    // Push updates to PEXA
    const workspaceData = pexaService.mapCaseDataToPEXAWorkspace(caseData);
    await pexaService.updateWorkspace(workspaceId, workspaceData);
    
    // Update cache
    const syncedWorkspace = {
      ...workspace,
      ...workspaceData,
      financialSettlement,
      tasks,
      documents,
      lastSyncedAt: new Date().toISOString()
    };
    
    await kv.set(`pexa_workspace:${workspaceId}`, syncedWorkspace);

    console.log(`Synced PEXA workspace: ${workspaceId}`);
    
    return c.json({
      success: true,
      workspace: syncedWorkspace,
      message: 'Workspace synced successfully'
    });
    
  } catch (error) {
    console.error('PEXA sync error:', error);
    return c.json({ 
      error: `Sync failed: ${error.message}`,
      message: 'Could not sync with PEXA. Please try again.'
    }, 500);
  }
});

// Get outstanding PEXA tasks
app.get("/make-server-b186a255/pexa/workspace/:workspaceId/tasks/outstanding", async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    
    if (!workspaceId) {
      return c.json({ error: 'Workspace ID required' }, 400);
    }

    const outstandingTasks = await pexaService.getOutstandingTasks(workspaceId);
    
    return c.json({
      success: true,
      tasks: outstandingTasks,
      count: outstandingTasks.length
    });
    
  } catch (error) {
    console.error('PEXA outstanding tasks error:', error);
    return c.json({ 
      error: `Failed to retrieve tasks: ${error.message}` 
    }, 500);
  }
});

// Get financial settlement details
app.get("/make-server-b186a255/pexa/workspace/:workspaceId/financial", async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    
    if (!workspaceId) {
      return c.json({ error: 'Workspace ID required' }, 400);
    }

    const financialSettlement = await pexaService.getFinancialSettlement(workspaceId);
    const settlementStatement = await pexaService.getSettlementStatement(workspaceId);
    
    return c.json({
      success: true,
      financialSettlement,
      settlementStatement
    });
    
  } catch (error) {
    console.error('PEXA financial data error:', error);
    return c.json({ 
      error: `Failed to retrieve financial data: ${error.message}` 
    }, 500);
  }
});

// Submit workspace for settlement
app.post("/make-server-b186a255/pexa/workspace/:workspaceId/submit", async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    
    if (!workspaceId) {
      return c.json({ error: 'Workspace ID required' }, 400);
    }

    // Check outstanding tasks
    const outstandingTasks = await pexaService.getOutstandingTasks(workspaceId);
    
    if (outstandingTasks.length > 0) {
      return c.json({ 
        error: 'Cannot submit with outstanding tasks',
        outstandingTasks,
        message: `Please complete ${outstandingTasks.length} outstanding tasks before submission`
      }, 400);
    }

    // Submit for settlement
    const result = await pexaService.submitForSettlement(workspaceId);
    
    // Update cache
    const workspace = await kv.get(`pexa_workspace:${workspaceId}`);
    if (workspace) {
      workspace.status = 'settlement_booked';
      workspace.submittedAt = new Date().toISOString();
      await kv.set(`pexa_workspace:${workspaceId}`, workspace);
    }

    console.log(`Submitted PEXA workspace for settlement: ${workspaceId}`);
    
    return c.json({
      success: true,
      result,
      message: 'Workspace submitted for settlement successfully'
    });
    
  } catch (error) {
    console.error('PEXA submission error:', error);
    return c.json({ 
      error: `Submission failed: ${error.message}`,
      message: 'Please check all requirements are met'
    }, 500);
  }
});

// Submit for financial settlement
app.post("/make-server-b186a255/pexa/workspace/:workspaceId/financial/submit", async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    
    if (!workspaceId) {
      return c.json({ error: 'Workspace ID required' }, 400);
    }

    const result = await pexaService.submitForFinancialSettlement(workspaceId);
    
    console.log(`Submitted financial settlement: ${workspaceId}`);
    
    return c.json({
      success: true,
      result,
      message: 'Financial settlement submitted successfully'
    });
    
  } catch (error) {
    console.error('PEXA financial submission error:', error);
    return c.json({ 
      error: `Financial submission failed: ${error.message}` 
    }, 500);
  }
});

// Upload document to PEXA workspace
app.post("/make-server-b186a255/pexa/workspace/:workspaceId/documents", async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    const body = await c.req.json();
    const { documentType, fileName, content } = body;
    
    if (!workspaceId || !documentType || !fileName || !content) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const document = await pexaService.uploadDocument(workspaceId, {
      documentType,
      fileName,
      content
    });
    
    console.log(`Uploaded document to PEXA workspace: ${workspaceId}`);
    
    return c.json({
      success: true,
      document,
      message: 'Document uploaded successfully'
    });
    
  } catch (error) {
    console.error('PEXA document upload error:', error);
    return c.json({ 
      error: `Document upload failed: ${error.message}` 
    }, 500);
  }
});

// Trigger digital signing
app.post("/make-server-b186a255/pexa/workspace/:workspaceId/documents/:documentId/sign", async (c) => {
  try {
    const workspaceId = c.req.param('workspaceId');
    const documentId = c.req.param('documentId');
    const body = await c.req.json();
    const { signatories } = body;
    
    if (!workspaceId || !documentId || !signatories) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const result = await pexaService.triggerDigitalSigning(workspaceId, documentId, signatories);
    
    console.log(`Triggered digital signing for document: ${documentId} in workspace: ${workspaceId}`);
    
    return c.json({
      success: true,
      result,
      message: 'Digital signing initiated'
    });
    
  } catch (error) {
    console.error('PEXA digital signing error:', error);
    return c.json({ 
      error: `Digital signing failed: ${error.message}` 
    }, 500);
  }
});

// PEXA webhook endpoint (public - no auth required)
app.post("/make-server-b186a255/pexa/webhook", async (c) => {
  try {
    const event = await c.req.json();
    
    console.log('Received PEXA webhook:', event.eventType);
    
    // Process webhook event
    await pexaService.handleWebhook(event);
    
    // Store webhook event
    const webhookId = `webhook_${Date.now()}`;
    await kv.set(`pexa_webhook:${webhookId}`, {
      ...event,
      receivedAt: new Date().toISOString(),
      processed: true
    });
    
    // Update workspace cache based on event
    if (event.workspaceId) {
      const workspace = await kv.get(`pexa_workspace:${event.workspaceId}`);
      if (workspace) {
        // Update status based on event type
        switch (event.eventType) {
          case 'settlement.booked':
            workspace.status = 'settlement_booked';
            break;
          case 'settlement.completed':
            workspace.status = 'settled';
            workspace.settlementCompletedAt = event.timestamp;
            break;
          case 'settlement.failed':
            workspace.status = 'failed';
            break;
          case 'lodgement.completed':
            workspace.lodgementCompletedAt = event.timestamp;
            break;
        }
        workspace.lastWebhookAt = event.timestamp;
        await kv.set(`pexa_workspace:${event.workspaceId}`, workspace);
      }
    }
    
    return c.json({
      success: true,
      message: 'Webhook processed'
    });
    
  } catch (error) {
    console.error('PEXA webhook error:', error);
    return c.json({ 
      error: `Webhook processing failed: ${error.message}` 
    }, 500);
  }
});

// Get workspace for a case ID
app.get("/make-server-b186a255/pexa/case/:caseId/workspace", async (c) => {
  try {
    const caseId = c.req.param('caseId');
    
    if (!caseId) {
      return c.json({ error: 'Case ID required' }, 400);
    }

    // Get workspace mapping
    const mapping = await kv.get(`case_pexa_mapping:${caseId}`);
    
    if (!mapping) {
      return c.json({ 
        success: false,
        message: 'No PEXA workspace found for this case'
      }, 404);
    }

    // Get workspace details
    const workspace = await kv.get(`pexa_workspace:${mapping.workspaceId}`);
    
    return c.json({
      success: true,
      workspace,
      mapping
    });
    
  } catch (error) {
    console.error('PEXA case lookup error:', error);
    return c.json({ 
      error: `Case lookup failed: ${error.message}` 
    }, 500);
  }
});
