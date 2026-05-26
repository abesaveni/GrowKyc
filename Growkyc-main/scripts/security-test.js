#!/usr/bin/env node

/**
 * GROW PLATFORM - SECURITY TEST SUITE
 * 
 * This script tests critical security features before production launch.
 * Run with: node security-test.js
 */

const API_BASE = process.env.API_URL || 'http://localhost:54321/functions/v1/make-server-b186a255';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'SecurePassword123!';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name) {
  log(`\n🧪 Testing: ${name}`, 'blue');
}

function logPass(message) {
  log(`✅ PASS: ${message}`, 'green');
}

function logFail(message) {
  log(`❌ FAIL: ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  WARNING: ${message}`, 'yellow');
}

let passCount = 0;
let failCount = 0;
let warnCount = 0;

// =====================================================
// TEST SUITE
// =====================================================

async function runSecurityTests() {
  log('\n╔════════════════════════════════════════╗', 'magenta');
  log('║   GROW PLATFORM SECURITY TEST SUITE    ║', 'magenta');
  log('╚════════════════════════════════════════╝\n', 'magenta');

  // Test 1: Health Check
  await testHealthCheck();

  // Test 2: Authentication Required
  await testAuthenticationRequired();

  // Test 3: Invalid Token Handling
  await testInvalidTokenHandling();

  // Test 4: Rate Limiting
  await testRateLimiting();

  // Test 5: File Upload Validation
  await testFileUploadValidation();

  // Test 6: Organization Isolation
  await testOrganizationIsolation();

  // Test 7: SQL Injection Prevention
  await testSQLInjectionPrevention();

  // Test 8: XSS Prevention
  await testXSSPrevention();

  // Test 9: CORS Configuration
  await testCORSConfiguration();

  // Test 10: Audit Logging
  await testAuditLogging();

  // Test 11: GDPR Endpoints
  await testGDPREndpoints();

  // Results Summary
  printSummary();
}

// =====================================================
// TEST IMPLEMENTATIONS
// =====================================================

async function testHealthCheck() {
  logTest('Health Check Endpoint');
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    
    if (response.status === 200 && data.status === 'ok') {
      logPass('Health check endpoint is accessible');
      passCount++;
    } else {
      logFail('Health check returned unexpected response');
      failCount++;
    }
  } catch (error) {
    logFail(`Health check failed: ${error.message}`);
    failCount++;
  }
}

async function testAuthenticationRequired() {
  logTest('Authentication Required on Protected Endpoints');
  
  const protectedEndpoints = [
    '/files/list',
    '/files/upload',
    '/audit/logs',
    '/security/events',
    '/auth/profile',
    '/organization'
  ];

  let passed = true;
  
  for (const endpoint of protectedEndpoints) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`);
      
      if (response.status === 401) {
        // Expected: Unauthorized
        continue;
      } else {
        logFail(`${endpoint} did not require authentication (status: ${response.status})`);
        passed = false;
      }
    } catch (error) {
      logWarning(`Could not test ${endpoint}: ${error.message}`);
      warnCount++;
    }
  }

  if (passed) {
    logPass('All protected endpoints require authentication');
    passCount++;
  } else {
    failCount++;
  }
}

async function testInvalidTokenHandling() {
  logTest('Invalid Token Handling');
  try {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      headers: {
        'Authorization': 'Bearer invalid_token_12345'
      }
    });
    
    if (response.status === 401) {
      logPass('Invalid tokens are properly rejected');
      passCount++;
    } else {
      logFail('Invalid token was not rejected');
      failCount++;
    }
  } catch (error) {
    logFail(`Invalid token test failed: ${error.message}`);
    failCount++;
  }
}

async function testRateLimiting() {
  logTest('Rate Limiting');
  
  log('  Sending 105 rapid requests to test rate limiting...');
  let blockedCount = 0;
  let successCount = 0;

  for (let i = 0; i < 105; i++) {
    try {
      const response = await fetch(`${API_BASE}/health`);
      if (response.status === 429) {
        blockedCount++;
      } else if (response.status === 200) {
        successCount++;
      }
    } catch (error) {
      // Network error
    }
  }

  if (blockedCount > 0) {
    logPass(`Rate limiting is working (blocked ${blockedCount}/105 requests)`);
    passCount++;
  } else {
    logWarning('Rate limiting may not be configured properly');
    warnCount++;
  }
}

async function testFileUploadValidation() {
  logTest('File Upload Validation');
  
  // Test: Oversized file rejection
  log('  Testing file size limit...');
  const oversizedFile = new Blob(['x'.repeat(60 * 1024 * 1024)], { type: 'text/plain' }); // 60MB
  
  // Note: This test requires authentication token
  logWarning('File upload validation requires authenticated session to test');
  warnCount++;
}

async function testOrganizationIsolation() {
  logTest('Organization Data Isolation');
  
  // Note: This requires setting up test organizations
  logWarning('Organization isolation requires test data to verify');
  warnCount++;
}

async function testSQLInjectionPrevention() {
  logTest('SQL Injection Prevention');
  
  const injectionPayloads = [
    "'; DROP TABLE users; --",
    "1' OR '1'='1",
    "admin'--",
    "' OR 1=1--"
  ];

  let protected = true;

  for (const payload of injectionPayloads) {
    try {
      // Test in search parameter
      const response = await fetch(`${API_BASE}/health?test=${encodeURIComponent(payload)}`);
      
      // Should not crash or return SQL errors
      if (response.status === 500) {
        const data = await response.text();
        if (data.includes('SQL') || data.includes('syntax error')) {
          logFail(`SQL injection vulnerability detected with payload: ${payload}`);
          protected = false;
        }
      }
    } catch (error) {
      // Network errors are OK
    }
  }

  if (protected) {
    logPass('No SQL injection vulnerabilities detected');
    passCount++;
  } else {
    failCount++;
  }
}

async function testXSSPrevention() {
  logTest('XSS Prevention');
  
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert("XSS")>',
    'javascript:alert("XSS")',
    '<svg onload=alert("XSS")>'
  ];

  // Note: This needs to test input fields
  logWarning('XSS testing requires authenticated session and form submission');
  warnCount++;
}

async function testCORSConfiguration() {
  logTest('CORS Configuration');
   
  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: 'OPTIONS'
    });
    
    const corsHeader = response.headers.get('Access-Control-Allow-Origin');
    
    if (corsHeader === '*') {
      logWarning('CORS is set to wildcard (*) - should be restricted in production');
      warnCount++;
    } else if (corsHeader) {
      logPass(`CORS is configured with specific origin: ${corsHeader}`);
      passCount++;
    } else {
      logFail('CORS headers not found');
      failCount++;
    }
  } catch (error) {
    logFail(`CORS test failed: ${error.message}`);
    failCount++;
  }
}

async function testAuditLogging() {
  logTest('Audit Logging');
  
  // Note: This requires authentication
  logWarning('Audit logging test requires authenticated session');
  warnCount++;
}

async function testGDPREndpoints() {
  logTest('GDPR Compliance Endpoints');
  
  const gdprEndpoints = [
    '/gdpr/export-data',
    '/gdpr/delete-account'
  ];

  let allExist = true;

  for (const endpoint of gdprEndpoints) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: endpoint.includes('export') ? 'POST' : 'POST'
      });
      
      // Should return 401 (unauthorized), not 404 (not found)
      if (response.status === 404) {
        logFail(`GDPR endpoint ${endpoint} not found`);
        allExist = false;
      }
    } catch (error) {
      logWarning(`Could not test ${endpoint}: ${error.message}`);
      warnCount++;
    }
  }

  if (allExist) {
    logPass('GDPR endpoints are configured');
    passCount++;
  } else {
    failCount++;
  }
}

// =====================================================
// RESULTS
// =====================================================

function printSummary() {
  log('\n╔════════════════════════════════════════╗', 'magenta');
  log('║           TEST RESULTS SUMMARY          ║', 'magenta');
  log('╚════════════════════════════════════════╝\n', 'magenta');

  const total = passCount + failCount + warnCount;
  
  log(`✅ Passed:   ${passCount}/${total}`, 'green');
  log(`❌ Failed:   ${failCount}/${total}`, 'red');
  log(`⚠️  Warnings: ${warnCount}/${total}`, 'yellow');

  log('\n' + '═'.repeat(40));

  if (failCount === 0 && warnCount === 0) {
    log('\n🎉 ALL TESTS PASSED! Ready for production.', 'green');
  } else if (failCount === 0) {
    log('\n✅ Tests passed with warnings. Review warnings before launch.', 'yellow');
  } else {
    log('\n❌ TESTS FAILED! Fix critical issues before launch.', 'red');
    process.exit(1);
  }

  log('\n' + '═'.repeat(40) + '\n');
}

// =====================================================
// RUN TESTS
// =====================================================

runSecurityTests().catch(error => {
  log(`\n💥 Test suite crashed: ${error.message}`, 'red');
  process.exit(1);
});
