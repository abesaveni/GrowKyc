// Detailed AML/CTF Hits and Match Information

export interface SanctionsMatch {
  id: string;
  matchedName: string;
  listName: string;
  matchStrength: 'Exact' | 'High' | 'Medium' | 'Low';
  country: string;
  dateAdded: string;
  reason: string;
  source: string;
  sourceUrl: string;
}

export interface PEPMatch {
  id: string;
  name: string;
  pepType: 'Domestic PEP' | 'Foreign PEP' | 'International Org PEP';
  position: string;
  organization: string;
  country: string;
  dateIdentified: string;
  source: string;
  sourceUrl: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface AdverseMediaHit {
  id: string;
  headline: string;
  summary: string;
  publication: string;
  publishDate: string;
  category: 'Financial Crime' | 'Fraud' | 'Corruption' | 'Regulatory' | 'Legal' | 'Reputational';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  url: string;
  relevanceScore: number;
}

export const AML_HITS_DATABASE: Record<string, {
  sanctions: SanctionsMatch[];
  pep: PEPMatch[];
  adverseMedia: AdverseMediaHit[];
}> = {
  // ABC Enterprises - Clean with minor adverse media
  'client-001': {
    sanctions: [],
    pep: [],
    adverseMedia: [
      {
        id: 'am-001-1',
        headline: 'ABC Enterprises Settles Minor Contractual Dispute',
        summary: 'Technology services firm ABC Enterprises Pty Ltd reached an out-of-court settlement in a contractual disagreement with a former vendor. The matter was resolved amicably with no admission of fault by either party. Industry experts note such disputes are common in the fast-paced tech services sector.',
        publication: 'Australian Financial Review',
        publishDate: '2024-11-15',
        category: 'Legal',
        severity: 'Low',
        url: 'https://www.afr.com/technology/abc-enterprises-contract-settlement-20241115',
        relevanceScore: 45
      },
      {
        id: 'am-001-2',
        headline: 'Tech Sector Faces Increased Regulatory Scrutiny',
        summary: 'Several Australian technology services companies, including ABC Enterprises, are adapting to new data privacy regulations. ABC Enterprises spokesperson confirmed full compliance with updated guidelines and implementation of enhanced data protection measures across all client engagements.',
        publication: 'TechCrunch Australia',
        publishDate: '2025-03-22',
        category: 'Regulatory',
        severity: 'Low',
        url: 'https://techcrunch.com/au/tech-sector-privacy-compliance-2025',
        relevanceScore: 38
      }
    ]
  },

  // Smith Family Trust - Clean
  'client-002': {
    sanctions: [],
    pep: [],
    adverseMedia: []
  },

  // Dr. James Patterson - PEP with adverse media
  'client-003': {
    sanctions: [],
    pep: [
      {
        id: 'pep-003-1',
        name: 'Dr. James Patterson',
        pepType: 'Domestic PEP',
        position: 'Board Member',
        organization: 'Victorian Healthcare Advisory Board',
        country: 'Australia',
        dateIdentified: '2023-06-15',
        source: 'Australian Government - Health Department',
        sourceUrl: 'https://www.health.gov.au/about-us/advisory-boards/victorian-healthcare',
        riskLevel: 'Medium'
      }
    ],
    adverseMedia: [
      {
        id: 'am-003-1',
        headline: 'Healthcare Advisory Board Reviews Controversial Policy',
        summary: 'The Victorian Healthcare Advisory Board, including member Dr. James Patterson, faced public scrutiny over proposed changes to healthcare funding allocation. Dr. Patterson was quoted defending the board\'s evidence-based approach and commitment to equitable healthcare access across all Victorian communities.',
        publication: 'The Age',
        publishDate: '2024-08-12',
        category: 'Reputational',
        severity: 'Low',
        url: 'https://www.theage.com.au/healthcare/advisory-board-policy-review-20240812',
        relevanceScore: 52
      },
      {
        id: 'am-003-2',
        headline: 'Medical Practitioners Voice Concerns Over Healthcare Reforms',
        summary: 'Healthcare professionals, including Advisory Board member Dr. James Patterson, expressed concerns about the pace of healthcare system reforms. Dr. Patterson emphasized the need for adequate consultation with frontline medical staff and warned against rushed implementation that could compromise patient care quality.',
        publication: 'Medical Journal of Australia',
        publishDate: '2025-01-20',
        category: 'Regulatory',
        severity: 'Low',
        url: 'https://www.mja.com.au/journal/healthcare-reforms-consultation-2025',
        relevanceScore: 48
      },
      {
        id: 'am-003-3',
        headline: 'Advisory Board Member Calls for Transparency in Health Funding',
        summary: 'Dr. James Patterson, member of the Victorian Healthcare Advisory Board, called for greater transparency in health funding allocation processes. His advocacy for public disclosure of funding criteria was praised by patient advocacy groups and transparency watchdogs.',
        publication: 'Sydney Morning Herald',
        publishDate: '2024-10-05',
        category: 'Reputational',
        severity: 'Low',
        url: 'https://www.smh.com.au/politics/healthcare-funding-transparency-20241005',
        relevanceScore: 41
      },
      {
        id: 'am-003-4',
        headline: 'Conflict of Interest Allegations Investigated and Dismissed',
        summary: 'Allegations of potential conflict of interest involving Dr. James Patterson\'s dual roles as private practitioner and advisory board member were formally investigated by the Victorian Health Department ethics committee. The investigation concluded with full exoneration, finding all proper disclosure protocols had been meticulously followed and no actual conflict existed.',
        publication: 'Australian Broadcasting Corporation',
        publishDate: '2024-05-30',
        category: 'Legal',
        severity: 'Medium',
        url: 'https://www.abc.net.au/news/2024-05-30/healthcare-ethics-investigation-dismissed',
        relevanceScore: 65
      },
      {
        id: 'am-003-5',
        headline: 'Medical Board Commends Dr. Patterson for Ethics Leadership',
        summary: 'The Australian Medical Board publicly commended Dr. James Patterson for his leadership in establishing new ethics guidelines for medical practitioners serving on government advisory boards. His framework for conflict of interest management has been adopted as a national best practice standard.',
        publication: 'Australian Doctor',
        publishDate: '2025-02-14',
        category: 'Reputational',
        severity: 'Low',
        url: 'https://www.ausdoc.com.au/news/medical-board-ethics-commendation-2025',
        relevanceScore: 35
      }
    ]
  },

  // Global Trade Solutions - Critical sanctions and adverse media
  'client-004': {
    sanctions: [
      {
        id: 'sanc-004-1',
        matchedName: 'Viktor Petrov',
        listName: 'OFAC Specially Designated Nationals (SDN)',
        matchStrength: 'Exact',
        country: 'Russia',
        dateAdded: '2022-03-10',
        reason: 'Designated due to activities undermining the sovereignty of Ukraine and supporting Russian government policies. Individual operates through multiple shell companies and offshore entities to facilitate transactions for sanctioned Russian entities.',
        source: 'U.S. Department of Treasury - Office of Foreign Assets Control',
        sourceUrl: 'https://sanctionssearch.ofac.treas.gov'
      },
      {
        id: 'sanc-004-2',
        matchedName: 'Petrov, Viktor Aleksandrovich',
        listName: 'EU Consolidated Sanctions List',
        matchStrength: 'Exact',
        country: 'Russia',
        dateAdded: '2022-03-15',
        reason: 'EU sanctions imposed for supporting actions and implementing policies which undermine or threaten the territorial integrity, sovereignty and independence of Ukraine. Asset freeze and travel ban in effect.',
        source: 'European Union External Action Service',
        sourceUrl: 'https://www.sanctionsmap.eu'
      },
      {
        id: 'sanc-004-3',
        matchedName: 'PETROV Viktor',
        listName: 'UK Consolidated List of Financial Sanctions',
        matchStrength: 'Exact',
        country: 'Russia',
        dateAdded: '2022-03-18',
        reason: 'Individual designated under the UK sanctions regime relating to Russia. Subject to an asset freeze. Involved in obtaining a benefit from or supporting the Government of Russia through international trade operations.',
        source: 'UK Office of Financial Sanctions Implementation',
        sourceUrl: 'https://www.gov.uk/government/publications/financial-sanctions-russia'
      }
    ],
    pep: [
      {
        id: 'pep-004-1',
        name: 'Chen Wei',
        pepType: 'Foreign PEP',
        position: 'Former Deputy Director',
        organization: 'Ministry of Commerce Regional Bureau',
        country: 'China',
        dateIdentified: '2020-06-12',
        source: 'WorldCheck - Refinitiv',
        sourceUrl: 'https://www.refinitiv.com/en/products/world-check-kyc-screening',
        riskLevel: 'High'
      }
    ],
    adverseMedia: [
      {
        id: 'am-004-1',
        headline: 'Import/Export Firm Linked to Sanctioned Russian Oligarch',
        summary: 'Global Trade Solutions Ltd has come under intense scrutiny after investigators discovered that majority shareholder Offshore Holdings BVI is ultimately controlled by sanctioned Russian national Viktor Petrov. Documents reveal a complex web of shell companies across multiple jurisdictions designed to obscure beneficial ownership. Australian authorities have launched a formal investigation.',
        publication: 'Reuters',
        publishDate: '2024-02-28',
        category: 'Financial Crime',
        severity: 'Critical',
        url: 'https://www.reuters.com/world/australia-investigates-trade-firm-sanctions-links-2024-02-28',
        relevanceScore: 98
      },
      {
        id: 'am-004-2',
        headline: 'Trade Company Faces Money Laundering Probe',
        summary: 'Federal authorities are investigating Global Trade Solutions Ltd for potential money laundering and sanctions evasion. The investigation focuses on suspicious transaction patterns involving high-value goods traded with entities in sanctioned jurisdictions. Company representatives declined to comment pending the outcome of the investigation.',
        publication: 'Financial Times',
        publishDate: '2024-06-15',
        category: 'Financial Crime',
        severity: 'Critical',
        url: 'https://www.ft.com/content/australia-trade-firm-laundering-probe',
        relevanceScore: 96
      },
      {
        id: 'am-004-3',
        headline: 'Shell Company Network Exposed in Sanctions Evasion Scheme',
        summary: 'Investigative journalists uncovered an elaborate network of shell companies, including British Virgin Islands-registered Offshore Holdings BVI, used to conceal sanctioned individuals\' ownership interests in Australian trading operations. Global Trade Solutions is among several companies identified as potential vehicles for sanctions circumvention.',
        publication: 'International Consortium of Investigative Journalists',
        publishDate: '2023-11-22',
        category: 'Financial Crime',
        severity: 'Critical',
        url: 'https://www.icij.org/investigations/sanctions-evasion-network-australia',
        relevanceScore: 94
      },
      {
        id: 'am-004-4',
        headline: 'Trade Firm Director Under Investigation for False Declarations',
        summary: 'Anna Kowalski, director of Global Trade Solutions, is under investigation by Australian Border Force for allegedly providing false declarations on import documentation. The investigation is examining whether goods were systematically misdeclared to evade duties and disguise their true origin from sanctioned regions.',
        publication: 'The Australian',
        publishDate: '2024-09-10',
        category: 'Regulatory',
        severity: 'High',
        url: 'https://www.theaustralian.com.au/nation/trade-director-investigation-false-declarations',
        relevanceScore: 88
      },
      {
        id: 'am-004-5',
        headline: 'AUSTRAC Files Suspicious Matter Reports on Trading Company',
        summary: 'Australia\'s financial intelligence agency AUSTRAC has filed multiple Suspicious Matter Reports (SMRs) concerning Global Trade Solutions Ltd. The reports flag unusual transaction patterns, unexplained wealth movements, and potential structuring to avoid reporting thresholds. Banking partners have been advised to apply enhanced due diligence.',
        publication: 'Sydney Morning Herald',
        publishDate: '2024-11-05',
        category: 'Financial Crime',
        severity: 'Critical',
        url: 'https://www.smh.com.au/business/banking-and-finance/austrac-smrs-filed-trading-company-20241105',
        relevanceScore: 97
      },
      {
        id: 'am-004-6',
        headline: 'Chinese Official\'s Son Holds Stake in Australian Trade Firm',
        summary: 'Chen Wei, shareholder in Global Trade Solutions, has been identified as the son of a senior Chinese commerce ministry official. Concerns have been raised about potential conflicts of interest and whether the connection facilitated preferential treatment in cross-border trade arrangements.',
        publication: 'South China Morning Post',
        publishDate: '2023-08-17',
        category: 'Corruption',
        severity: 'High',
        url: 'https://www.scmp.com/news/asia/chinese-official-family-business-connections',
        relevanceScore: 82
      },
      {
        id: 'am-004-7',
        headline: 'Trading Company Ordered to Produce Records in Sanctions Investigation',
        summary: 'A federal court has ordered Global Trade Solutions to produce five years of financial and transactional records as part of an ongoing sanctions compliance investigation. The company unsuccessfully challenged the production order, with the court ruling that authorities had established sufficient grounds for the investigation.',
        publication: 'Bloomberg',
        publishDate: '2025-01-12',
        category: 'Legal',
        severity: 'High',
        url: 'https://www.bloomberg.com/news/articles/court-orders-records-production-sanctions-probe',
        relevanceScore: 91
      },
      {
        id: 'am-004-8',
        headline: 'Banks Terminate Relationships with Sanctioned-Linked Trading Firm',
        summary: 'Three major Australian banks have terminated banking relationships with Global Trade Solutions Ltd, citing unacceptable compliance risks following the discovery of ownership links to sanctioned individuals. The company is reportedly struggling to find alternative banking arrangements.',
        publication: 'Australian Financial Review',
        publishDate: '2024-12-20',
        category: 'Financial Crime',
        severity: 'Critical',
        url: 'https://www.afr.com/companies/financial-services/banks-exit-sanctions-linked-client-20241220',
        relevanceScore: 95
      },
      {
        id: 'am-004-9',
        headline: 'Export Permits Suspended Pending Sanctions Compliance Review',
        summary: 'The Department of Foreign Affairs and Trade has suspended export permits for Global Trade Solutions pending completion of a comprehensive sanctions compliance review. The suspension affects multiple contracts and has triggered concerns among legitimate trading partners who were unaware of the beneficial ownership issues.',
        publication: 'The Guardian Australia',
        publishDate: '2025-02-05',
        category: 'Regulatory',
        severity: 'Critical',
        url: 'https://www.theguardian.com/australia-news/export-permits-suspended-sanctions-review',
        relevanceScore: 93
      },
      {
        id: 'am-004-10',
        headline: 'Compliance Failures Exposed at Import/Export Company',
        summary: 'Internal documents leaked from Global Trade Solutions reveal systematic failures in anti-money laundering controls, inadequate customer due diligence, and a corporate culture that prioritized profits over compliance. Former employees describe pressure to overlook red flags in high-value transactions.',
        publication: 'ABC News Australia',
        publishDate: '2024-07-30',
        category: 'Regulatory',
        severity: 'High',
        url: 'https://www.abc.net.au/news/2024-07-30/trade-firm-compliance-failures-exposed',
        relevanceScore: 89
      },
      {
        id: 'am-004-11',
        headline: 'International Sanctions Network Traced to Australian Operations',
        summary: 'A joint investigation by Australian Federal Police and international partners has traced a sophisticated sanctions evasion network to operations centered around Global Trade Solutions. The network allegedly used trade-based money laundering techniques to move funds on behalf of sanctioned Russian entities.',
        publication: 'Financial Review',
        publishDate: '2024-10-22',
        category: 'Financial Crime',
        severity: 'Critical',
        url: 'https://www.afr.com/policy/foreign-affairs/sanctions-evasion-network-traced-australia-20241022',
        relevanceScore: 99
      },
      {
        id: 'am-004-12',
        headline: 'Directors Face Potential Criminal Charges Over Sanctions Breach',
        summary: 'Commonwealth prosecutors are considering criminal charges against directors of Global Trade Solutions for alleged knowing breach of Australian sanctions laws. If charged, directors could face up to 10 years imprisonment and significant financial penalties under the Autonomous Sanctions Act 2011.',
        publication: 'The Age',
        publishDate: '2025-03-01',
        category: 'Legal',
        severity: 'Critical',
        url: 'https://www.theage.com.au/national/directors-face-sanctions-breach-charges-20250301',
        relevanceScore: 97
      }
    ]
  },

  // Anderson & Partners - Clean
  'client-005': {
    sanctions: [],
    pep: [],
    adverseMedia: []
  },

  // Pacific Investment Holdings - Foreign PEP with moderate adverse media
  'client-006': {
    sanctions: [],
    pep: [
      {
        id: 'pep-006-1',
        name: 'Lawrence Tan Keng Huat',
        pepType: 'Foreign PEP',
        position: 'Former Member of Parliament',
        organization: 'Parliament of Singapore',
        country: 'Singapore',
        dateIdentified: '2018-03-20',
        source: 'LexisNexis World Compliance',
        sourceUrl: 'https://risk.lexisnexis.com/global/en/products/world-compliance-data',
        riskLevel: 'Medium'
      }
    ],
    adverseMedia: [
      {
        id: 'am-006-1',
        headline: 'Former Singapore MP Expands Business Interests to Australia',
        summary: 'Lawrence Tan, former Member of Parliament in Singapore, has expanded his family\'s investment holdings into Australian markets through Pacific Investment Holdings. While the business activities appear legitimate, transparency advocates have called for greater disclosure of political connections in cross-border investments.',
        publication: 'Straits Times',
        publishDate: '2023-12-10',
        category: 'Reputational',
        severity: 'Low',
        url: 'https://www.straitstimes.com/singapore/former-mp-business-expansion-australia',
        relevanceScore: 55
      },
      {
        id: 'am-006-2',
        headline: 'Investment Firm Draws Scrutiny Over Political Connections',
        summary: 'Pacific Investment Holdings has attracted regulatory attention in both Singapore and Australia due to the political background of its beneficial owner Lawrence Tan. Regulators emphasize they are conducting routine enhanced due diligence given the PEP status, and no violations have been identified.',
        publication: 'Business Times Singapore',
        publishDate: '2024-04-18',
        category: 'Regulatory',
        severity: 'Medium',
        url: 'https://www.businesstimes.com.sg/companies-markets/investment-firm-political-connections-scrutiny',
        relevanceScore: 68
      },
      {
        id: 'am-006-3',
        headline: 'Former Politician\'s Family Trust Structures Under Review',
        summary: 'The complex trust structures used by the Tan family to hold international investments, including the Tan Family Trust which owns 45% of Pacific Investment Holdings, have been subject to review by Singaporean tax authorities. The review is described as routine for high-net-worth individuals with international holdings.',
        publication: 'Asia Financial News',
        publishDate: '2024-08-25',
        category: 'Regulatory',
        severity: 'Low',
        url: 'https://www.asiafinancialnews.com/family-trust-structures-tax-review',
        relevanceScore: 61
      }
    ]
  }
};
