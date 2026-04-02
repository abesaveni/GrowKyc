# Grow KYC SaaS Integration Architecture

## 🎯 Overview

**Grow KYC** is a **standalone SaaS product** (paid subscription) that replaces all KYC functionality in Brickbanq and other client systems.

### **Key Principle:**
> **"Anything to do with KYC is done in the Grow KYC software/module"**

---

## 🏗️ Architecture

### **Old Architecture (Brickbanq):**
```
┌─────────────────────────────────────┐
│ Brickbanq Platform                  │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ Client Dashboard            │   │
│ │  • Client Details           │   │
│ │  • KYC Review Detail ❌     │   │ ← REPLACED
│ │  • Documents                │   │
│ │  • Transactions             │   │
│ └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### **New Architecture (Integrated):**
```
┌──────────────────────────────┐       ┌────────────────────────────────┐
│ Brickbanq Platform           │       │ Grow KYC (SaaS Module)         │
│                              │       │ 💰 Paid Subscription           │
│ ┌──────────────────────────┐ │       │                                │
│ │ Client Dashboard         │ │       │ ┌────────────────────────────┐ │
│ │  • Client Details        │ │       │ │ Client KYC Dashboard       │ │
│ │  • Documents             │ │       │ │  • Risk Snapshot (5 scores)│ │
│ │  • Transactions          │ │       │ │  • Client Snapshot         │ │
│ │                          │ │       │ │  • Key Alerts              │ │
│ │  [View KYC Profile] ────────────────▶│  • KYC Status Grid         │ │
│ │   (Opens Grow KYC)       │ │       │ │  • Identity (Equifax)      │ │
│ └──────────────────────────┘ │       │ │  • AML (ComplyAdvantage)   │ │
│                              │       │ │  • Entity (ASIC)           │ │
└──────────────────────────────┘       │ │  • Business Risk (Illion)  │ │
                                       │ │  • 12 Detail Tabs          │ │
                                       │ │  • Risk Intelligence Panel │ │
                                       │ │  • Decision Workflow       │ │
                                       │ └────────────────────────────┘ │
                                       │                                │
                                       │ ┌────────────────────────────┐ │
                                       │ │ Case Management Module     │ │
                                       │ │  • Case Control Centre     │ │
                                       │ │  • Case Workbench          │ │
                                       │ │  • Create Manual Cases     │ │
                                       │ └────────────────────────────┘ │
                                       │                                │
                                       │ ┌────────────────────────────┐ │
                                       │ │ AUSTRAC Reporting Module   │ │
                                       │ │  • 9 Production Screens    │ │
                                       │ └────────────────────────────┘ │
                                       └────────────────────────────────┘
```

---

## 📋 KYC Review Feature Coverage Checklist

### **What Was in Brickbanq's "KYC Review Detail":**

Let me map each feature to the **Grow KYC** module:

| Brickbanq KYC Review Feature | Grow KYC Coverage | Location in Grow KYC |
|------------------------------|-------------------|---------------------|
| **Client Identity Verification** | ✅ COVERED | Client KYC Dashboard → Identity Tab |
| **Document Upload/Review** | ✅ COVERED | Client KYC Dashboard → Documents Tab |
| **AML Screening** | ✅ COVERED | Client KYC Dashboard → AML Tab |
| **Sanctions Screening** | ✅ COVERED | Client KYC Dashboard → AML Tab → Sanctions |
| **PEP Screening** | ✅ COVERED | Client KYC Dashboard → AML Tab → PEP |
| **Adverse Media** | ✅ COVERED | Client KYC Dashboard → AML Tab → Adverse Media |
| **Entity Verification (ASIC)** | ✅ COVERED | Client KYC Dashboard → Entity Tab |
| **Ownership Structure** | ✅ COVERED | Client KYC Dashboard → Ownership Tab |
| **Beneficial Owners (UBO)** | ✅ COVERED | Client KYC Dashboard → Ownership Tab |
| **Credit Check** | ✅ COVERED | Client KYC Dashboard → Financial Tab |
| **Business Risk Assessment** | ✅ COVERED | Client KYC Dashboard → KYC Status Grid → Business Risk Card |
| **Risk Scoring** | ✅ COVERED | Client KYC Dashboard → Risk Snapshot Bar (5 scores) |
| **Decision Recording** | ✅ COVERED | Client KYC Dashboard → Decisions Tab |
| **Approval/Rejection** | ✅ COVERED | Client KYC Dashboard → Risk Intelligence Panel |
| **Monitoring Alerts** | ✅ COVERED | Client KYC Dashboard → Monitoring Tab |
| **Audit Trail** | ✅ COVERED | Client KYC Dashboard → Audit Log Tab |
| **KYC Status** | ✅ COVERED | Client KYC Dashboard → Quick Status Indicators |
| **Review Dates** | ✅ COVERED | Client KYC Dashboard → Summary Strip (Last/Next Review) |
| **Risk Alerts** | ✅ COVERED | Client KYC Dashboard → Key Alerts Section |
| **Provider Results** | ✅ COVERED | Client KYC Dashboard → All tabs show provider attribution |
| **Re-run Checks** | ✅ COVERED | Client KYC Dashboard → Action buttons on each card |
| **Notes/Comments** | ✅ COVERED | Case Management → Notes Tab |
| **Linked Cases** | ✅ COVERED | Client KYC Dashboard → AUSTRAC Tab |
| **Service Restrictions** | ✅ COVERED | Case Management → Service Controls |

### **Additional Features in Grow KYC (Beyond Brickbanq):**

| Feature | Enhancement |
|---------|------------|
| **6 Data Providers** | Equifax, ASIC, Illion, ComplyAdvantage, LexisNexis, Chainalysis |
| **22 AI-Powered Bots** | Auto-screening across all tiers |
| **Case Management** | Full investigation workflow |
| **AUSTRAC Reporting** | 9 production screens for regulator submissions |
| **Multi-Jurisdictional** | 7 countries supported |
| **Smart Onboarding** | Personalized pathways |
| **Compliance Copilot AI** | In-app AI helper |
| **Integration Hub** | Unified data integrations |
| **Transaction Monitoring** | Real-time monitoring module |

---

## 🔗 Integration Points

### **1. Single Sign-On (SSO)**

Brickbanq users click "View KYC Profile" → Auto-login to Grow KYC (same session)

```
User Journey:
1. User logged into Brickbanq
2. Clicks "View KYC Profile" on client record
3. Opens Grow KYC Client Dashboard (new tab/window)
4. No re-authentication needed (SSO token)
5. Directly lands on client's KYC profile
```

### **2. Client Data Sync**

Brickbanq client records sync to Grow KYC:

**Synced Fields:**
- Client Name
- Entity Type (Individual/Company/Trust)
- ABN/ACN
- Date of Birth (if individual)
- Country
- Industry
- Contact Details
- Unique Client ID (for linking)

**Sync Method:** API webhook on client creation/update

### **3. Status Push-Back**

Grow KYC pushes status updates back to Brickbanq:

**Pushed Data:**
- KYC Status (Verified/Pending/Review/Blocked)
- Risk Level (Low/Medium/High/Critical)
- Last Review Date
- Next Review Date
- Service Restrictions (if any)

**Display in Brickbanq:**
```
┌────────────────────────────────────┐
│ Client: ABC Enterprises Pty Ltd    │
├────────────────────────────────────┤
│ KYC Status: ✅ Verified            │
│ Risk Level: 🟡 Medium (42/100)     │
│ Last Review: 2026-03-15            │
│ Next Review: 2026-06-15            │
│                                    │
│ [View Full KYC Profile →]          │ ← Opens Grow KYC
└────────────────────────────────────┘
```

### **4. Webhook Notifications**

Grow KYC sends real-time alerts to Brickbanq:

**Events:**
- ⚠️ High-risk alert detected
- 🚨 Case created (sanctions, PEP, fraud)
- ⏰ Review due soon
- ✅ KYC approved
- ❌ KYC rejected
- 🔴 Service hold applied

**Brickbanq Action:**
- Display alert banner
- Email notification to account manager
- Block transactions (if service hold)

### **5. API Endpoints**

**Grow KYC → Brickbanq:**
```
POST /api/brickbanq/client/kyc-status
{
  "clientId": "BRK-12345",
  "kycStatus": "verified",
  "riskLevel": "medium",
  "riskScore": 42,
  "lastReview": "2026-03-15",
  "nextReview": "2026-06-15",
  "restrictions": null
}
```

**Brickbanq → Grow KYC:**
```
POST /api/grow-kyc/client/sync
{
  "clientId": "BRK-12345",
  "name": "ABC Enterprises Pty Ltd",
  "entityType": "company",
  "abn": "12 345 678 901",
  "country": "Australia",
  "industry": "Technology Services"
}
```

---

## 💰 Subscription Model

### **Grow KYC Pricing Tiers:**

| Tier | Monthly Price | Features |
|------|--------------|----------|
| **Starter** | $199/month | 50 clients, Basic KYC, 2 users |
| **Professional** | $499/month | 200 clients, Full KYC + Cases, 5 users |
| **Enterprise** | $999/month | Unlimited, AUSTRAC + Monitoring, 10 users |
| **White Label** | Custom | Your brand, API access, Unlimited |

### **Brickbanq Integration Options:**

**Option A: Built-in Subscription**
- Brickbanq bundles Grow KYC into their pricing
- Brickbanq pays wholesale rate to Grow
- Seamless user experience

**Option B: Add-on Subscription**
- Users see "Upgrade to Grow KYC" in Brickbanq
- Click → Purchase Grow KYC subscription
- Auto-enable integration

**Option C: Enterprise Partnership**
- Brickbanq white-labels Grow KYC
- Appears as "Brickbanq KYC powered by Grow"
- Custom branding maintained

---

## 🎨 User Experience

### **Scenario: Trust Administrator Reviews Client**

**Old Flow (Brickbanq only):**
```
1. Open Brickbanq
2. Navigate to Clients
3. Click client "ABC Enterprises"
4. Scroll to "KYC Review Detail"
5. Review basic info
6. Limited data, no provider integrations
```

**New Flow (Brickbanq + Grow KYC):**
```
1. Open Brickbanq
2. Navigate to Clients
3. Click client "ABC Enterprises"
4. See KYC summary badge: ✅ Verified (Risk: 42)
5. Click "View Full KYC Profile"
   ↓
6. Grow KYC Client Dashboard opens (new tab)
7. See complete risk snapshot in under 5 seconds:
   - Overall Risk: 42/100 (Medium)
   - AML Risk: 38/100 (Green)
   - Financial Risk: 55/100 (Amber)
   - 2 Matches detected (PEP + Media)
   - Entity Active ✅
   - Identity Verified ✅
8. Drill into any area:
   - Click "AML" tab → See ComplyAdvantage results
   - Click "Ownership" tab → See UBO graph
   - Click "Decisions" tab → See approval history
9. Run new checks if needed (1 click)
10. Make decision (Approve/Escalate/Reject)
11. Return to Brickbanq (status auto-updated)
```

**Time Saved:** 10 minutes → 2 minutes  
**Data Depth:** Basic → Comprehensive (6 providers)  
**Decision Quality:** Improved (full evidence + AI insights)

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     BRICKBANQ PLATFORM                      │
│                                                             │
│  Client Record Created/Updated                             │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────────┐                                       │
│  │ Webhook Trigger │───────────────────┐                   │
│  └─────────────────┘                   │                   │
│                                         │                   │
└─────────────────────────────────────────┼───────────────────┘
                                          │
                                          │ POST /api/client/sync
                                          │ {clientData}
                                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    GROW KYC SaaS MODULE                     │
│                                                             │
│  Client Data Received                                       │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────┐                                  │
│  │ Auto-Create Profile  │                                  │
│  └──────────────────────┘                                  │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────┐                                  │
│  │ Trigger 22 AI Bots   │                                  │
│  │  • Equifax           │                                  │
│  │  • ASIC              │                                  │
│  │  • Illion            │                                  │
│  │  • ComplyAdvantage   │                                  │
│  │  • LexisNexis        │                                  │
│  │  • Chainalysis       │                                  │
│  └──────────────────────┘                                  │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────┐                                  │
│  │ Calculate Risk Score │                                  │
│  │  Overall: 42/100     │                                  │
│  └──────────────────────┘                                  │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────┐                                  │
│  │ Generate Alerts      │                                  │
│  │  ⚠️ PEP Detected     │                                  │
│  │  📰 2 Media Articles │                                  │
│  └──────────────────────┘                                  │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────┐                                  │
│  │ Auto-Create Cases    │                                  │
│  │  (if high risk)      │                                  │
│  └──────────────────────┘                                  │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────┐                                  │
│  │ Push Status Update   │───────────────────┐              │
│  └──────────────────────┘                   │              │
│                                              │              │
└──────────────────────────────────────────────┼──────────────┘
                                               │
                                               │ POST /api/kyc-status
                                               │ {status, risk, dates}
                                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     BRICKBANQ PLATFORM                      │
│                                                             │
│  ┌─────────────────────────────┐                           │
│  │ Update Client Record        │                           │
│  │  • KYC Status: Verified ✅  │                           │
│  │  • Risk Level: Medium 🟡    │                           │
│  │  • Last Review: 2026-03-15  │                           │
│  └─────────────────────────────┘                           │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────────────────────┐                           │
│  │ Display Status in Dashboard │                           │
│  └─────────────────────────────┘                           │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────────────────────┐                           │
│  │ Show [View KYC Profile]     │                           │
│  │ Button (Opens Grow KYC)     │                           │
│  └─────────────────────────────┘                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security & Compliance

### **Data Isolation:**
- Each Brickbanq account gets isolated Grow KYC tenant
- Client data never shared between tenants
- SOC 2 Type II compliant

### **Access Control:**
- Brickbanq admin maps users to Grow KYC roles
- Role-based permissions enforced
- Audit trail for all access

### **Data Residency:**
- Australian data stays in Australia (AWS Sydney)
- GDPR compliant for EU clients
- AUSTRAC compliant

---

## 📈 Migration Path

### **Phase 1: Integration Setup** (Week 1)
- [ ] Brickbanq purchases Grow KYC subscription
- [ ] API keys exchanged
- [ ] SSO configured
- [ ] Webhook endpoints set up

### **Phase 2: Data Sync** (Week 2)
- [ ] Bulk import existing Brickbanq clients to Grow KYC
- [ ] Auto-run screening on all clients
- [ ] Generate initial risk scores
- [ ] Push status back to Brickbanq

### **Phase 3: UI Integration** (Week 3)
- [ ] Add "View KYC Profile" button to Brickbanq client pages
- [ ] Display KYC status badges
- [ ] Show risk scores
- [ ] Embed alerts

### **Phase 4: Go Live** (Week 4)
- [ ] Remove old "KYC Review Detail" section from Brickbanq
- [ ] Train users on new workflow
- [ ] Monitor integration
- [ ] Collect feedback

---

## ✅ Verification: Complete KYC Coverage

### **Grow KYC Client Dashboard Covers:**

| Category | Features | Status |
|----------|----------|--------|
| **Identity** | Equifax verification, fraud flags, confidence scores | ✅ |
| **AML** | Sanctions, PEP, Adverse Media (ComplyAdvantage) | ✅ |
| **Entity** | ASIC data, directors, registration status | ✅ |
| **Ownership** | UBO graph, beneficial owners, verification | ✅ |
| **Financial** | Credit scores (Equifax + Illion), defaults | ✅ |
| **Business Risk** | Insolvency, court signals, director risk | ✅ |
| **Legal** | Court records, litigation (LexisNexis) | ✅ |
| **Documents** | Upload, storage, expiry tracking | ✅ |
| **Monitoring** | AML alerts, credit alerts, ongoing screening | ✅ |
| **Decisions** | Approval/rejection workflow, conditions | ✅ |
| **AUSTRAC** | Case linkage, reporting, submissions | ✅ |
| **Audit** | Complete trail of all actions/changes | ✅ |
| **Risk Scoring** | 5 risk dimensions (Overall, AML, Financial, Business, Ownership) | ✅ |
| **Alerts** | Real-time alerts for high-risk events | ✅ |
| **Cases** | Full case management for investigations | ✅ |
| **Service Controls** | Restrictions, holds, disengage options | ✅ |

### **Additional Value vs. Brickbanq KYC:**

- ✅ **6 data providers** (vs. manual review)
- ✅ **Real-time screening** (vs. periodic)
- ✅ **AI-powered automation** (vs. manual processes)
- ✅ **Case management** (not in Brickbanq)
- ✅ **AUSTRAC reporting** (not in Brickbanq)
- ✅ **Multi-jurisdictional** (not in Brickbanq)
- ✅ **Ongoing monitoring** (not in Brickbanq)
- ✅ **Complete audit trail** (enhanced vs. Brickbanq)

---

## 🎯 Summary

### **Grow KYC SaaS Module = Complete KYC Solution**

**Replaces:** Brickbanq's "KYC Review Detail"  
**Covers:** ✅ 100% of previous functionality + significant enhancements  
**Integration:** Seamless via SSO, API, webhooks  
**User Experience:** Superior (5 seconds to see full risk vs. 10+ minutes)  
**Compliance:** Enhanced (6 providers, AUSTRAC-ready, full audit)  

### **Brickbanq Benefits:**

1. ✅ **Offload complexity** - Let Grow KYC handle all compliance
2. ✅ **Better user experience** - Professional KYC dashboard
3. ✅ **Reduced liability** - External compliance experts
4. ✅ **Revenue opportunity** - Resell Grow KYC to clients
5. ✅ **Stay focused** - Focus on core trust/banking features

### **Client Benefits:**

1. ✅ **Faster onboarding** - Automated screening
2. ✅ **Better risk insights** - 6 data providers
3. ✅ **Regulatory compliance** - AUSTRAC-ready
4. ✅ **Single dashboard** - All KYC in one place
5. ✅ **Audit-ready** - Complete evidence trail

---

## 🚀 Next Steps

1. **Finalize integration specs** with Brickbanq team
2. **Set up API sandbox** for testing
3. **Configure SSO** (SAML/OAuth)
4. **Bulk import** Brickbanq clients
5. **Train users** on new workflow
6. **Launch** and monitor

**Grow KYC is ready to replace Brickbanq's KYC Review Detail completely!** ✅
