# 🤖 AI BOTS DEVELOPER GUIDE

## Grow Compliance OS - AI-Powered Screening & Due Diligence Bots

**Version:** 1.0.0  
**Last Updated:** March 22, 2026  
**Document Type:** Technical Reference - AI Bot System

---

## 📖 OVERVIEW

The Grow Compliance OS includes a sophisticated AI-powered bot system that automates compliance screening, due diligence, and risk assessment. These bots operate continuously across client lifecycles and are integrated throughout the KYC dashboard tabs.

### Integration Points

**All bots are accessed and managed through the KYC Dashboard tabs:**
- Client Profile Tabs (17 tabs)
- AML/CTF Screening Tab
- Risk Assessment Tab
- Compliance Status Tab
- Monitoring Alerts Tab
- Audit Trail Tab

**This document explains what each bot does for developers.**

---

## 🏗️ BOT ARCHITECTURE

### How Bots Work

```typescript
// Bot execution flow
interface AIBot {
  id: string;
  name: string;
  tier: 1 | 2 | 3 | 4 | 5;
  category: BotCategory;
  
  // Core execution
  execute(context: BotContext): Promise<BotResult>;
  
  // Scheduling
  schedule: ScheduleConfig;
  
  // Status
  getStatus(): BotStatus;
}

type BotCategory = 
  | 'screening'           // PEP, Sanctions, Adverse Media
  | 'verification'        // Identity, Document
  | 'due_diligence'       // KYB, Ownership, SOF, SOW
  | 'risk_assessment'     // Risk scoring, decision engine
  | 'monitoring'          // Continuous monitoring
  | 'legal'               // Court, litigation
  | 'decision'            // Automated decisioning
  | 'commercial';         // Commercial intelligence

// Bot execution context
interface BotContext {
  clientId: string;
  entityType: 'individual' | 'company' | 'trust' | 'partnership';
  jurisdiction: Country;
  riskLevel: RiskLevel;
  metadata: Record<string, any>;
}

// Bot result
interface BotResult {
  success: boolean;
  confidence: number;      // 0-1 confidence score
  findings: Finding[];
  recommendations: Recommendation[];
  actions: Action[];
  timestamp: Date;
}
```

### Bot Triggering

Bots are triggered by:
1. **Manual execution** - From client profile tabs
2. **Automated scheduling** - Monthly rescreening
3. **Event-based** - Client status changes, transactions
4. **Workflow integration** - Part of onboarding/review flows

---

## 🤖 TIER 1 BOTS: FOUNDATION SCREENING

### 1. Global PEP Screening Bot

**Purpose:** Politically Exposed Person detection and monitoring

**What It Does:**
- Screens clients against global PEP databases
- Identifies politically exposed individuals
- Detects family members and close associates of PEPs
- Monitors for PEP status changes monthly
- Flags foreign PEP relationships
- AUSTRAC compliant reporting

**Technical Implementation:**
```typescript
interface PEPScreeningBot extends AIBot {
  id: 'pep_screening';
  tier: 1;
  category: 'screening';
  
  // Execute PEP screening
  async execute(context: BotContext): Promise<PEPResult> {
    // 1. Query global PEP databases
    const pepDatabases = [
      'world-check',
      'dow-jones',
      'refinitiv',
      'custom-pep-lists'
    ];
    
    // 2. Screen against each database
    const results = await Promise.all(
      pepDatabases.map(db => this.screenDatabase(db, context))
    );
    
    // 3. Analyze relationships
    const relationships = await this.analyzeRelationships(context);
    
    // 4. Assess PEP risk
    const riskScore = this.calculatePEPRisk(results, relationships);
    
    // 5. Generate findings
    return {
      isPEP: results.some(r => r.matched),
      pepType: this.determinePEPType(results),
      relationships: relationships,
      riskScore: riskScore,
      findings: this.generateFindings(results),
      nextReview: this.scheduleNextReview()
    };
  }
}
```

**Scheduling:**
- **New clients:** Immediate upon onboarding
- **Existing clients:** Monthly automated rescreening
- **Manual trigger:** From AML/CTF tab

**Output Location:**
- Client Profile → AML/CTF Checks tab
- Compliance Status tab
- Monitoring Alerts tab (if PEP detected)

---

### 2. Global Adverse Media Screening Bot

**Purpose:** Negative news and reputational risk detection

**What It Does:**
- Scans global news sources for adverse mentions
- Detects financial crime allegations
- Monitors court proceedings and legal actions
- Identifies insolvency and bankruptcy proceedings
- Tracks regulatory enforcement actions
- Monthly rescreening for new adverse media

**Technical Implementation:**
```typescript
interface AdverseMediaBot extends AIBot {
  id: 'adverse_media';
  tier: 1;
  category: 'screening';
  
  async execute(context: BotContext): Promise<AdverseMediaResult> {
    // 1. Define search parameters
    const searchCategories = [
      'financial_crime',
      'fraud',
      'money_laundering',
      'corruption',
      'bribery',
      'sanctions_violations',
      'insolvency',
      'bankruptcy',
      'regulatory_enforcement',
      'court_proceedings'
    ];
    
    // 2. Search global news sources
    const newsResults = await this.searchNewsSources(context, {
      sources: ['reuters', 'bloomberg', 'local-news', 'regulatory-sites'],
      timeframe: '10-years',
      languages: ['en', 'zh', 'es', 'ar']
    });
    
    // 3. AI-powered relevance scoring
    const scoredArticles = await this.scoreRelevance(newsResults);
    
    // 4. Categorize findings
    const categorized = this.categorizeFrauds(scoredArticles);
    
    // 5. Risk assessment
    return {
      hasAdverseMedia: scoredArticles.length > 0,
      articles: scoredArticles,
      categories: categorized,
      severity: this.assessSeverity(scoredArticles),
      recommendations: this.generateRecommendations(categorized)
    };
  }
}
```

**Key Features:**
- **AI-powered filtering** - Reduces false positives
- **Sentiment analysis** - Distinguishes severity
- **Source reliability** - Weights trusted sources higher
- **Timeline tracking** - Historical vs recent issues

**Output Location:**
- Client Profile → AML/CTF Checks tab → Adverse Media section
- Monitoring Alerts tab
- Audit Trail tab

---

### 3. Global Sanctions Screening Bot

**Purpose:** Sanctions list screening and compliance

**What It Does:**
- Screens against OFAC, UN, EU, AUSTRAC sanctions lists
- Identifies sanctioned individuals and entities
- Detects indirect sanctions exposure
- Monitors for new sanctions additions
- Screens family members and associates
- Multi-jurisdictional compliance

**Technical Implementation:**
```typescript
interface SanctionsBot extends AIBot {
  id: 'sanctions_screening';
  tier: 1;
  category: 'screening';
  
  async execute(context: BotContext): Promise<SanctionsResult> {
    // 1. Compile sanctions lists
    const sanctionsLists = [
      'OFAC_SDN',           // US Treasury
      'UN_SANCTIONS',       // United Nations
      'EU_SANCTIONS',       // European Union
      'AUSTRAC_SANCTIONS',  // Australia
      'UK_HMT',             // UK Treasury
      'DFAT_AUTONOMOUS'     // Australia DFAT
    ];
    
    // 2. Fuzzy matching
    const matches = await Promise.all(
      sanctionsLists.map(list => 
        this.fuzzyMatch(context.client, list, {
          threshold: 0.85,
          includeAliases: true,
          includePreviousNames: true
        })
      )
    );
    
    // 3. Relationship analysis
    const indirectExposure = await this.checkIndirectExposure(context);
    
    // 4. Risk scoring
    return {
      isSanctioned: matches.some(m => m.confidence > 0.95),
      matches: matches.filter(m => m.confidence > 0.70),
      indirectExposure: indirectExposure,
      jurisdictions: this.getAffectedJurisdictions(matches),
      severity: 'critical'
    };
  }
}
```

**Matching Algorithms:**
- Exact name matching
- Fuzzy matching (Levenshtein distance)
- Phonetic matching (Soundex, Metaphone)
- Alias and DOB verification

**Output Location:**
- Client Profile → AML/CTF Checks tab → Sanctions section
- Compliance Status tab (blocks approval if matched)
- AUSTRAC Reporting tab (automatic SMR if required)

---

### 4. Global Identity Verification Bot

**Purpose:** Identity document verification and validation

**What It Does:**
- Verifies identity documents (passport, driver's license, ID card)
- Validates document authenticity
- Extracts data via OCR
- Cross-references with government databases
- Biometric verification (if enabled)
- Liveness detection for fraud prevention

**Technical Implementation:**
```typescript
interface IdentityBot extends AIBot {
  id: 'identity_verification';
  tier: 1;
  category: 'verification';
  
  async execute(context: BotContext): Promise<IdentityResult> {
    // 1. Document extraction
    const extractedData = await this.ocrExtraction(context.documents);
    
    // 2. Authenticity checks
    const authenticity = await this.verifyAuthenticity(context.documents, {
      checkHolograms: true,
      checkWatermarks: true,
      checkFonts: true,
      checkSecurity: true
    });
    
    // 3. Database verification (InfoTrack/GreenID)
    const dbVerification = await this.externalVerification(extractedData);
    
    // 4. Biometric matching (if photo available)
    const biometric = await this.biometricMatch(context);
    
    // 5. 100-point ID check (Australia)
    const pointCheck = this.calculate100PointScore(context.documents);
    
    return {
      verified: dbVerification.success && authenticity.genuine,
      confidence: this.calculateConfidence([
        authenticity.score,
        dbVerification.score,
        biometric.score
      ]),
      documentType: extractedData.type,
      pointScore: pointCheck,
      findings: this.generateFindings([authenticity, dbVerification])
    };
  }
}
```

**Integration Points:**
- InfoTrack API
- GreenID API
- Equifax verification
- Government databases (DVS for Australia)

**Output Location:**
- Client Profile → Identity Verification tab
- Compliance Status tab
- Documents tab (verification results)

---

### 5. Global KYB (Know Your Business) Screening Bot

**Purpose:** Business entity verification and screening

**What It Does:**
- Verifies business registration and structure
- Screens company directors and officers
- Validates ABN/ACN (Australia) or equivalent
- Checks business legitimacy
- Monitors business status changes
- Detects shelf companies and phoenixing

**Technical Implementation:**
```typescript
interface KYBBot extends AIBot {
  id: 'kyb_screening';
  tier: 1;
  category: 'due_diligence';
  
  async execute(context: BotContext): Promise<KYBResult> {
    // 1. Business registry verification
    const registryData = await this.verifyRegistry(context, {
      sources: ['ASIC', 'ABR', 'Companies-House', 'SEC']
    });
    
    // 2. Director and officer screening
    const officerScreening = await Promise.all(
      registryData.officers.map(officer => 
        this.screenPerson(officer)
      )
    );
    
    // 3. Business legitimacy checks
    const legitimacy = await this.checkLegitimacy({
      registrationAge: registryData.age,
      tradingHistory: await this.getTradingHistory(context),
      websitePresence: await this.checkWebsite(context),
      physicalAddress: await this.verifyAddress(context)
    });
    
    // 4. Risk indicators
    const riskIndicators = this.detectRiskIndicators({
      shelfCompany: this.isShelfCompany(registryData),
      phoenixing: await this.detectPhoenixing(context),
      dormant: legitimacy.tradingActivity === 'none'
    });
    
    return {
      verified: registryData.active && legitimacy.score > 0.7,
      companyStatus: registryData.status,
      officers: officerScreening,
      riskIndicators: riskIndicators,
      legitimacyScore: legitimacy.score
    };
  }
}
```

**Data Sources:**
- ASIC (Australia)
- ABR (Australian Business Register)
- Companies House (UK)
- SEC/State registries (US)
- Local business registries (7 countries)

**Output Location:**
- Client Profile → Entity Structure tab
- Client Profile → Directors & Shareholders tab
- Compliance Status tab

---

## 🏛️ TIER 2 BOTS: ENHANCED DUE DILIGENCE

### 6. Beneficial Ownership Mapping Bot

**Purpose:** Ultimate Beneficial Owner (UBO) identification

**What It Does:**
- Maps complete ownership chains (up to 10 layers deep)
- Identifies ultimate beneficial owners (25%+ ownership)
- Detects control without ownership (voting rights, board control)
- Flags gaps and inconsistencies in ownership structure
- Generates interactive ownership graphs
- AUSTRAC Tranche 2 compliant

**Technical Implementation:**
```typescript
interface BeneficialOwnershipBot extends AIBot {
  id: 'beneficial_ownership';
  tier: 2;
  category: 'due_diligence';
  
  async execute(context: BotContext): Promise<OwnershipResult> {
    // 1. Build ownership tree
    const ownershipTree = await this.buildOwnershipTree(context, {
      maxDepth: 10,
      threshold: 0.25  // 25% ownership threshold
    });
    
    // 2. Identify UBOs
    const ubos = this.identifyUBOs(ownershipTree, {
      ownershipThreshold: 0.25,
      controlThreshold: 0.50,
      includeVotingRights: true,
      includeBoardControl: true
    });
    
    // 3. Detect control mechanisms
    const controlAnalysis = await this.analyzeControl({
      votingRights: await this.getVotingRights(context),
      boardComposition: await this.getBoardComposition(context),
      specialRights: await this.getSpecialRights(context)
    });
    
    // 4. Gap analysis
    const gaps = this.detectGaps(ownershipTree, {
      missingOwners: this.findMissingOwners(ownershipTree),
      inconsistencies: this.findInconsistencies(ownershipTree),
      complexStructures: this.flagComplexStructures(ownershipTree)
    });
    
    // 5. Screen UBOs
    const uboScreening = await Promise.all(
      ubos.map(ubo => this.screenUBO(ubo))
    );
    
    return {
      ownershipTree: ownershipTree,
      ubos: ubos,
      control: controlAnalysis,
      gaps: gaps,
      screening: uboScreening,
      compliant: this.checkTranche2Compliance(ubos, gaps)
    };
  }
}
```

**Key Capabilities:**
- **Multi-layer mapping** - Traces through holding companies, trusts
- **Control detection** - Beyond just ownership percentage
- **Gap identification** - Flags missing information
- **Visual graphs** - Interactive ownership diagrams

**Output Location:**
- Client Profile → Beneficial Ownership tab
- Client Profile → Entity Structure tab
- Client Profile → Network Graph tab
- Compliance Status tab

---

### 7. Source of Funds (SOF) Verification Bot

**Purpose:** Transaction fund source verification

**What It Does:**
- Captures declared source of funds
- Validates evidence documentation
- Verifies transaction amounts and timing
- Detects suspicious patterns (structuring, smurfing)
- Flags third-party funding
- Reconciles declared vs actual sources

**Technical Implementation:**
```typescript
interface SourceOfFundsBot extends AIBot {
  id: 'source_of_funds';
  tier: 2;
  category: 'due_diligence';
  
  async execute(context: BotContext): Promise<SOFResult> {
    // 1. Capture declared source
    const declaredSource = context.transaction.declaredSource;
    
    // 2. Evidence collection
    const evidence = await this.collectEvidence(context, {
      required: this.getRequiredEvidence(declaredSource),
      provided: context.documents
    });
    
    // 3. Amount validation
    const amountValidation = this.validateAmount({
      declared: context.transaction.amount,
      source: declaredSource,
      plausibility: await this.assessPlausibility(context)
    });
    
    // 4. Pattern detection
    const patterns = await this.detectPatterns(context, {
      structuring: this.detectStructuring(context.transactions),
      smurfing: this.detectSmurfing(context.transactions),
      velocity: this.checkVelocity(context.transactions)
    });
    
    // 5. Third-party analysis
    const thirdParty = await this.analyzeThirdParty(context);
    
    return {
      verified: evidence.complete && amountValidation.plausible,
      declaredSource: declaredSource,
      evidence: evidence,
      patterns: patterns,
      thirdPartyFunding: thirdParty.detected,
      riskLevel: this.calculateSOFRisk(patterns, thirdParty)
    };
  }
}
```

**Evidence Types Required:**
- Salary: Payslips, employment contracts
- Sale of assets: Sale agreement, settlement statement
- Loan: Loan agreement, drawdown evidence
- Gift: Gift letter, donor's evidence
- Inheritance: Will, probate documents
- Investment returns: Brokerage statements

**Output Location:**
- Client Profile → Financial Information tab
- Client Profile → Documents tab
- Monitoring Alerts tab (if suspicious)

---

### 8. Source of Wealth (SOW) Verification Bot

**Purpose:** Overall wealth accumulation validation

**What It Does:**
- Captures wealth narrative
- Validates wealth accumulation timeline
- Reconciles income vs wealth
- Assesses age and career plausibility
- Evaluates foreign wealth sources
- High-value client due diligence

**Technical Implementation:**
```typescript
interface SourceOfWealthBot extends AIBot {
  id: 'source_of_wealth';
  tier: 2;
  category: 'due_diligence';
  
  async execute(context: BotContext): Promise<SOWResult> {
    // 1. Wealth narrative analysis
    const narrative = this.analyzeNarrative(context.wealthDeclaration, {
      sources: context.wealthSources,
      timeline: context.timeline,
      amounts: context.amounts
    });
    
    // 2. Income reconciliation
    const reconciliation = await this.reconcileIncomeWealth({
      declaredIncome: context.income,
      accumulatedWealth: context.wealth,
      period: context.timeline,
      expenses: this.estimateExpenses(context)
    });
    
    // 3. Plausibility assessment
    const plausibility = this.assessPlausibility({
      age: context.client.age,
      career: context.client.career,
      wealth: context.wealth,
      timeline: context.timeline,
      geography: context.geographicSources
    });
    
    // 4. Foreign wealth risk
    const foreignRisk = await this.assessForeignWealth({
      jurisdictions: context.foreignJurisdictions,
      sources: context.foreignSources,
      repatriation: context.repatriationMethod
    });
    
    return {
      verified: plausibility.score > 0.7 && reconciliation.plausible,
      narrative: narrative,
      plausibility: plausibility,
      reconciliation: reconciliation,
      foreignRisk: foreignRisk,
      recommendations: this.generateRecommendations(plausibility, foreignRisk)
    };
  }
}
```

**Plausibility Checks:**
- Age vs wealth accumulation time
- Career vs wealth sources
- Income history vs current wealth
- Geographic source credibility
- Timeline consistency

**Output Location:**
- Client Profile → Financial Information tab
- Client Profile → Risk Assessment tab
- Compliance Status tab

---

### 9. Court & Litigation Screening Bot

**Purpose:** Legal exposure and enforcement monitoring

**What It Does:**
- Screens court cases and tribunal matters
- Detects bankruptcy and insolvency proceedings
- Identifies director bans and disqualifications
- Monitors regulatory enforcement actions
- Tracks active litigation
- Assesses legal exposure risk

**Technical Implementation:**
```typescript
interface CourtLitigationBot extends AIBot {
  id: 'court_litigation';
  tier: 2;
  category: 'legal';
  
  async execute(context: BotContext): Promise<LegalResult> {
    // 1. Court case screening
    const courtCases = await this.searchCourts(context, {
      courts: ['federal', 'state', 'tribunal', 'family'],
      types: ['civil', 'criminal', 'administrative'],
      timeframe: '10-years'
    });
    
    // 2. Insolvency screening
    const insolvency = await this.checkInsolvency(context, {
      bankruptcy: await this.checkBankruptcy(context),
      liquidation: await this.checkLiquidation(context),
      administration: await this.checkAdministration(context)
    });
    
    // 3. Director bans
    const directorBans = await this.checkDirectorBans(context, {
      asic: await this.checkASICBans(context),
      disqualifications: await this.checkDisqualifications(context)
    });
    
    // 4. Regulatory enforcement
    const enforcement = await this.checkEnforcement(context, {
      austrac: await this.checkAUSTRACEnforcement(context),
      asic: await this.checkASICEnforcement(context),
      other: await this.checkOtherRegulators(context)
    });
    
    // 5. Risk assessment
    return {
      hasLegalIssues: courtCases.length > 0 || insolvency.active,
      courtCases: courtCases,
      insolvency: insolvency,
      directorBans: directorBans,
      enforcement: enforcement,
      severity: this.assessSeverity({
        courtCases,
        insolvency,
        directorBans,
        enforcement
      })
    };
  }
}
```

**Data Sources:**
- Federal Court of Australia
- State and Territory courts
- ASIC databases
- AFSA (bankruptcy register)
- AUSTRAC enforcement actions
- Tribunal decisions

**Output Location:**
- Client Profile → Legal Matters tab
- Client Profile → AML/CTF Checks tab
- Monitoring Alerts tab
- Risk Assessment tab

---

## 🎯 TIER 3-5 BOTS: ADVANCED AUTOMATION

### Tier 3: Automated Decision Engine

**Purpose:** Automated risk-based decisioning

**Capabilities:**
- Aggregates all Tier 1-2 bot results
- Applies risk scoring algorithms
- Makes automated approval/rejection decisions
- Routes cases based on risk thresholds
- Generates compliance reports
- Continuous decision monitoring

**Decision Matrix:**
```typescript
interface DecisionEngine {
  async makeDecision(context: DecisionContext): Promise<Decision> {
    // Aggregate all bot results
    const results = {
      screening: await this.getScreeningResults(context),
      verification: await this.getVerificationResults(context),
      dueDiligence: await this.getDueDiligenceResults(context),
      legal: await this.getLegalResults(context)
    };
    
    // Calculate composite risk score
    const riskScore = this.calculateRisk(results);
    
    // Apply decision rules
    if (riskScore >= 80) {
      return {
        decision: 'reject',
        reason: 'High risk profile',
        requiresApproval: 'partner'
      };
    } else if (riskScore >= 60) {
      return {
        decision: 'enhanced_due_diligence',
        reason: 'Medium-high risk',
        requiresApproval: 'compliance_officer'
      };
    } else {
      return {
        decision: 'approve',
        reason: 'Low risk profile',
        monitoring: 'standard'
      };
    }
  }
}
```

### Tier 4: Commercial Intelligence Engine

**Purpose:** Business intelligence and commercial analysis

**Capabilities:**
- Credit risk assessment
- Financial health analysis
- Industry benchmarking
- Trading pattern analysis
- Growth trajectory prediction
- Investment risk scoring

### Tier 5: Strategic Compliance Orchestrator

**Purpose:** Multi-jurisdictional compliance orchestration

**Capabilities:**
- Coordinates all 22 bots
- Multi-jurisdiction compliance
- Real-time compliance copilot
- Strategic risk advisory
- Regulatory change adaptation
- Enterprise-wide orchestration

---

## 🔄 BOT SCHEDULING & AUTOMATION

### Automated Rescreening

All screening bots run on automated schedules:

```typescript
interface BotSchedule {
  // Monthly rescreening
  pep: '0 0 1 * *',              // 1st of each month
  adverseMedia: '0 0 1 * *',     // 1st of each month
  sanctions: '0 0 1 * *',        // 1st of each month
  
  // Weekly monitoring
  courtLitigation: '0 0 * * 1',  // Every Monday
  
  // Continuous monitoring
  transactionMonitoring: 'realtime'
}
```

### Event-Based Triggers

Bots also trigger on events:
- Client status change
- High-value transaction
- Risk level increase
- Document upload
- Regulatory change
- Manual trigger from dashboard

---

## 📊 BOT RESULTS & REPORTING

### Result Storage

```typescript
interface BotExecution {
  id: string;
  botId: string;
  clientId: string;
  executedAt: Date;
  result: BotResult;
  confidence: number;
  findings: Finding[];
  status: 'success' | 'failed' | 'partial';
}

// Stored in:
// - Database for audit trail
// - Displayed in client profile tabs
// - Aggregated in compliance reports
// - Fed into decision engine
```

### Dashboard Integration

All bot results display in:
1. **Client Profile Tabs** - Detailed results per tab
2. **Compliance Status Tab** - Aggregate compliance view
3. **Monitoring Alerts Tab** - Active alerts from bots
4. **Audit Trail Tab** - Complete execution history
5. **Risk Assessment Tab** - Risk scores from all bots

---

## 🔧 DEVELOPER INTEGRATION

### Running a Bot Manually

```typescript
// Example: Trigger PEP screening from client profile
async function runPEPScreening(clientId: string) {
  const bot = botRegistry.get('pep_screening');
  
  const context: BotContext = {
    clientId: clientId,
    entityType: client.entityType,
    jurisdiction: client.jurisdiction,
    riskLevel: client.riskLevel
  };
  
  const result = await bot.execute(context);
  
  // Store result
  await storeBotResult(result);
  
  // Update client profile
  await updateClientAMLData(clientId, result);
  
  // Create alerts if needed
  if (result.isPEP) {
    await createAlert({
      type: 'PEP_DETECTED',
      clientId: clientId,
      severity: 'high'
    });
  }
  
  return result;
}
```

### Creating a Custom Bot

```typescript
// Example: Create custom industry-specific bot
class CustomIndustryBot implements AIBot {
  id = 'custom_industry_screening';
  tier = 2 as const;
  category = 'screening' as const;
  
  async execute(context: BotContext): Promise<BotResult> {
    // Your custom logic
    const analysis = await this.analyzeIndustry(context);
    
    return {
      success: true,
      confidence: analysis.confidence,
      findings: analysis.findings,
      recommendations: this.generateRecommendations(analysis),
      actions: []
    };
  }
  
  private async analyzeIndustry(context: BotContext) {
    // Custom industry analysis
    return {
      confidence: 0.85,
      findings: []
    };
  }
}

// Register custom bot
botRegistry.register(new CustomIndustryBot());
```

---

## 📚 SUMMARY FOR DEVELOPERS

### Key Takeaways

1. **Not UI Components** - These bots are backend services, not React components
2. **Dashboard Integration** - Results display in KYC Dashboard tabs
3. **Automated & Manual** - Bots run on schedule and on-demand
4. **Composable** - Tier 3-5 bots orchestrate Tier 1-2 bots
5. **Extensible** - New custom bots can be added to the registry

### Bot Execution Flow

```
User Action → KYC Dashboard Tab
      ↓
Manual Trigger Button
      ↓
Bot Execution (Backend)
      ↓
AI/ML Processing
      ↓
Result Generation
      ↓
Database Storage
      ↓
Dashboard Update (Real-time)
      ↓
Alert Generation (if needed)
      ↓
Audit Log Recording
```

---

**For implementation questions, see:**
- DEVELOPER_GUIDE.md → Integration Framework
- SYSTEM_ARCHITECTURE.md → AI Compliance Engine
- API documentation for each bot endpoint

---

**Version:** 1.0.0  
**Last Updated:** March 22, 2026  
**Status:** Production Documentation
