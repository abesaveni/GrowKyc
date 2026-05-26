// Related Entities Data - Entities where directors/shareholders have >25% ownership

export interface PersonAMLScreening {
  name: string;
  sanctionsMatches: number;
  sanctionsList?: string[];
  pepStatus: 'Not PEP' | 'Domestic PEP' | 'Foreign PEP' | 'International Org PEP';
  pepDetails?: string;
  adverseMediaHits: number;
  riskRating: 'Low' | 'Medium' | 'High' | 'Critical';
  lastScreened: string;
  redFlags: string[];
}

export interface Director {
  name: string;
  appointedDate: string;
  resignedDate?: string;
  status: 'Active' | 'Resigned';
  nationality: string;
  role: string;
  amlScreening: PersonAMLScreening;
}

export interface Shareholder {
  name: string;
  entityType: 'Individual' | 'Company';
  shares: number;
  percentage: number;
  acquisitionDate: string;
  nationality?: string;
  jurisdiction?: string;
  amlScreening: PersonAMLScreening;
}

export interface RelatedEntity {
  id: string;
  entityName: string;
  relationship: 'Director' | 'Shareholder' | 'Both';
  personName: string;
  ownershipPercentage: number;
  directorshipActive: boolean;
  entityType: 'Company' | 'Trust' | 'Partnership' | 'Foreign Entity';
  jurisdiction: string;
  industry: string;
  registrationNumber?: string;
  registrationDate: string;
  status: 'Active' | 'Inactive' | 'Under Administration' | 'Deregistered';
  riskRating: 'Low' | 'Medium' | 'High' | 'Critical';
  adverseFindings: string[];
  annualRevenue?: string;
  employees?: string;
  lastUpdated: string;
  directors: Director[];
  shareholders: Shareholder[];
}

export const RELATED_ENTITIES_DATABASE: Record<string, RelatedEntity[]> = {
  // ABC Enterprises Pty Ltd
  'client-001': [
    {
      id: 're-001-1',
      entityName: 'TechVentures Group Pty Ltd',
      relationship: 'Both',
      personName: 'Michael Chen',
      ownershipPercentage: 45,
      directorshipActive: true,
      entityType: 'Company',
      jurisdiction: 'Victoria, Australia',
      industry: 'Technology Investment',
      registrationNumber: 'ACN 234 567 890',
      registrationDate: '2020-06-15',
      status: 'Active',
      riskRating: 'Low',
      adverseFindings: [],
      annualRevenue: '$1.2M - $2.5M',
      employees: '5-10',
      lastUpdated: '2026-03-15',
      directors: [
        {
          name: 'Michael Chen',
          appointedDate: '2020-06-15',
          status: 'Active',
          nationality: 'Australian',
          role: 'Director',
          amlScreening: {
            name: 'Michael Chen',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-03-15',
            redFlags: []
          }
        }
      ],
      shareholders: [
        {
          name: 'Michael Chen',
          entityType: 'Individual',
          shares: 45,
          percentage: 45,
          acquisitionDate: '2020-06-15',
          nationality: 'Australian',
          amlScreening: {
            name: 'Michael Chen',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-03-15',
            redFlags: []
          }
        }
      ]
    },
    {
      id: 're-001-2',
      entityName: 'Chen Family Investment Trust',
      relationship: 'Shareholder',
      personName: 'Michael Chen',
      ownershipPercentage: 100,
      directorshipActive: false,
      entityType: 'Trust',
      jurisdiction: 'New South Wales, Australia',
      industry: 'Investment & Wealth Management',
      registrationDate: '2017-03-22',
      status: 'Active',
      riskRating: 'Low',
      adverseFindings: [],
      annualRevenue: 'Not Disclosed',
      lastUpdated: '2026-02-28',
      directors: [],
      shareholders: [
        {
          name: 'Michael Chen',
          entityType: 'Individual',
          shares: 100,
          percentage: 100,
          acquisitionDate: '2017-03-22',
          nationality: 'Australian',
          amlScreening: {
            name: 'Michael Chen',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-02-28',
            redFlags: []
          }
        }
      ]
    },
    {
      id: 're-001-3',
      entityName: 'SW Consulting Services Pty Ltd',
      relationship: 'Both',
      personName: 'Sarah Williams',
      ownershipPercentage: 75,
      directorshipActive: true,
      entityType: 'Company',
      jurisdiction: 'Queensland, Australia',
      industry: 'Management Consulting',
      registrationNumber: 'ACN 345 678 901',
      registrationDate: '2019-11-10',
      status: 'Active',
      riskRating: 'Low',
      adverseFindings: [],
      annualRevenue: '$800K - $1.5M',
      employees: '3-5',
      lastUpdated: '2026-03-10',
      directors: [
        {
          name: 'Sarah Williams',
          appointedDate: '2019-11-10',
          status: 'Active',
          nationality: 'Australian',
          role: 'Director',
          amlScreening: {
            name: 'Sarah Williams',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-03-10',
            redFlags: []
          }
        }
      ],
      shareholders: [
        {
          name: 'Sarah Williams',
          entityType: 'Individual',
          shares: 75,
          percentage: 75,
          acquisitionDate: '2019-11-10',
          nationality: 'Australian',
          amlScreening: {
            name: 'Sarah Williams',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-03-10',
            redFlags: []
          }
        }
      ]
    },
    {
      id: 're-001-4',
      entityName: 'Digital Solutions Alliance Pty Ltd',
      relationship: 'Director',
      personName: 'Sarah Williams',
      ownershipPercentage: 33,
      directorshipActive: true,
      entityType: 'Company',
      jurisdiction: 'Victoria, Australia',
      industry: 'Software Development',
      registrationNumber: 'ACN 456 789 012',
      registrationDate: '2021-08-05',
      status: 'Active',
      riskRating: 'Medium',
      adverseFindings: ['Late filing of annual returns (2025) - rectified'],
      annualRevenue: '$500K - $1M',
      employees: '8-12',
      lastUpdated: '2026-03-01',
      directors: [
        {
          name: 'Sarah Williams',
          appointedDate: '2021-08-05',
          status: 'Active',
          nationality: 'Australian',
          role: 'Director',
          amlScreening: {
            name: 'Sarah Williams',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-03-01',
            redFlags: []
          }
        }
      ],
      shareholders: [
        {
          name: 'Sarah Williams',
          entityType: 'Individual',
          shares: 33,
          percentage: 33,
          acquisitionDate: '2021-08-05',
          nationality: 'Australian',
          amlScreening: {
            name: 'Sarah Williams',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-03-01',
            redFlags: []
          }
        }
      ]
    }
  ],

  // The Smith Family Trust
  'client-002': [
    {
      id: 're-002-1',
      entityName: 'Smith Property Holdings Pty Ltd',
      relationship: 'Both',
      personName: 'Robert Smith',
      ownershipPercentage: 60,
      directorshipActive: true,
      entityType: 'Company',
      jurisdiction: 'New South Wales, Australia',
      industry: 'Real Estate Investment',
      registrationNumber: 'ACN 567 890 123',
      registrationDate: '2012-03-18',
      status: 'Active',
      riskRating: 'Low',
      adverseFindings: [],
      annualRevenue: '$8M - $15M',
      employees: '15-20',
      lastUpdated: '2026-03-18',
      directors: [
        {
          name: 'Robert Smith',
          appointedDate: '2012-03-18',
          status: 'Active',
          nationality: 'Australian',
          role: 'Director',
          amlScreening: {
            name: 'Robert Smith',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-03-18',
            redFlags: []
          }
        }
      ],
      shareholders: [
        {
          name: 'Robert Smith',
          entityType: 'Individual',
          shares: 60,
          percentage: 60,
          acquisitionDate: '2012-03-18',
          nationality: 'Australian',
          amlScreening: {
            name: 'Robert Smith',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-03-18',
            redFlags: []
          }
        }
      ]
    },
    {
      id: 're-002-2',
      entityName: 'Coastal Developments (NSW) Pty Ltd',
      relationship: 'Shareholder',
      personName: 'Robert Smith',
      ownershipPercentage: 40,
      directorshipActive: false,
      entityType: 'Company',
      jurisdiction: 'New South Wales, Australia',
      industry: 'Property Development',
      registrationNumber: 'ACN 678 901 234',
      registrationDate: '2015-09-22',
      status: 'Active',
      riskRating: 'Medium',
      adverseFindings: ['Planning dispute with local council (2024) - resolved'],
      annualRevenue: '$12M - $25M',
      employees: '25-30',
      lastUpdated: '2026-02-15',
      directors: [],
      shareholders: [
        {
          name: 'Robert Smith',
          entityType: 'Individual',
          shares: 40,
          percentage: 40,
          acquisitionDate: '2015-09-22',
          nationality: 'Australian',
          amlScreening: {
            name: 'Robert Smith',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-02-15',
            redFlags: []
          }
        }
      ]
    },
    {
      id: 're-002-3',
      entityName: 'MS Equity Partners Pty Ltd',
      relationship: 'Both',
      personName: 'Margaret Smith',
      ownershipPercentage: 50,
      directorshipActive: true,
      entityType: 'Company',
      jurisdiction: 'Victoria, Australia',
      industry: 'Investment Management',
      registrationNumber: 'ACN 789 012 345',
      registrationDate: '2016-05-30',
      status: 'Active',
      riskRating: 'Low',
      adverseFindings: [],
      annualRevenue: '$2M - $5M',
      employees: '5-8',
      lastUpdated: '2026-03-12',
      directors: [
        {
          name: 'Margaret Smith',
          appointedDate: '2016-05-30',
          status: 'Active',
          nationality: 'Australian',
          role: 'Director',
          amlScreening: {
            name: 'Margaret Smith',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-03-12',
            redFlags: []
          }
        }
      ],
      shareholders: [
        {
          name: 'Margaret Smith',
          entityType: 'Individual',
          shares: 50,
          percentage: 50,
          acquisitionDate: '2016-05-30',
          nationality: 'Australian',
          amlScreening: {
            name: 'Margaret Smith',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-03-12',
            redFlags: []
          }
        }
      ]
    },
    {
      id: 're-002-4',
      entityName: 'The Smith Education Foundation',
      relationship: 'Director',
      personName: 'Margaret Smith',
      ownershipPercentage: 0,
      directorshipActive: true,
      entityType: 'Company',
      jurisdiction: 'New South Wales, Australia',
      industry: 'Charitable Foundation',
      registrationNumber: 'ABN 890 123 456',
      registrationDate: '2018-11-05',
      status: 'Active',
      riskRating: 'Low',
      adverseFindings: [],
      annualRevenue: 'Not-for-Profit',
      lastUpdated: '2026-01-20',
      directors: [
        {
          name: 'Margaret Smith',
          appointedDate: '2018-11-05',
          status: 'Active',
          nationality: 'Australian',
          role: 'Director',
          amlScreening: {
            name: 'Margaret Smith',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-01-20',
            redFlags: []
          }
        }
      ],
      shareholders: []
    },
    {
      id: 're-002-5',
      entityName: 'Premium Portfolio Management Ltd',
      relationship: 'Shareholder',
      personName: 'Robert Smith',
      ownershipPercentage: 28,
      directorshipActive: false,
      entityType: 'Company',
      jurisdiction: 'Victoria, Australia',
      industry: 'Financial Services',
      registrationNumber: 'ACN 901 234 567',
      registrationDate: '2019-02-14',
      status: 'Active',
      riskRating: 'Low',
      adverseFindings: [],
      annualRevenue: '$3M - $6M',
      employees: '10-15',
      lastUpdated: '2026-02-28',
      directors: [],
      shareholders: [
        {
          name: 'Robert Smith',
          entityType: 'Individual',
          shares: 28,
          percentage: 28,
          acquisitionDate: '2019-02-14',
          nationality: 'Australian',
          amlScreening: {
            name: 'Robert Smith',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-02-28',
            redFlags: []
          }
        }
      ]
    }
  ],

  // Dr. James Patterson
  'client-003': [
    {
      id: 're-003-1',
      entityName: 'Patterson Medical Clinic Pty Ltd',
      relationship: 'Both',
      personName: 'Dr. James Patterson',
      ownershipPercentage: 100,
      directorshipActive: true,
      entityType: 'Company',
      jurisdiction: 'Victoria, Australia',
      industry: 'Healthcare - Medical Practice',
      registrationNumber: 'ACN 012 345 678',
      registrationDate: '2005-04-12',
      status: 'Active',
      riskRating: 'Low',
      adverseFindings: [],
      annualRevenue: '$2.5M - $5M',
      employees: '12-15',
      lastUpdated: '2026-03-20',
      directors: [
        {
          name: 'Dr. James Patterson',
          appointedDate: '2005-04-12',
          status: 'Active',
          nationality: 'Australian',
          role: 'Director',
          amlScreening: {
            name: 'Dr. James Patterson',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-03-20',
            redFlags: []
          }
        }
      ],
      shareholders: [
        {
          name: 'Dr. James Patterson',
          entityType: 'Individual',
          shares: 100,
          percentage: 100,
          acquisitionDate: '2005-04-12',
          nationality: 'Australian',
          amlScreening: {
            name: 'Dr. James Patterson',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-03-20',
            redFlags: []
          }
        }
      ]
    },
    {
      id: 're-003-2',
      entityName: 'HealthTech Innovations Pty Ltd',
      relationship: 'Both',
      personName: 'Dr. James Patterson',
      ownershipPercentage: 35,
      directorshipActive: true,
      entityType: 'Company',
      jurisdiction: 'Victoria, Australia',
      industry: 'Medical Technology',
      registrationNumber: 'ACN 123 456 780',
      registrationDate: '2018-09-25',
      status: 'Active',
      riskRating: 'Medium',
      adverseFindings: ['TGA compliance review (2024) - approved with conditions'],
      annualRevenue: '$1M - $2M',
      employees: '8-10',
      lastUpdated: '2026-03-15',
      directors: [
        {
          name: 'Dr. James Patterson',
          appointedDate: '2018-09-25',
          status: 'Active',
          nationality: 'Australian',
          role: 'Director',
          amlScreening: {
            name: 'Dr. James Patterson',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-03-15',
            redFlags: []
          }
        }
      ],
      shareholders: [
        {
          name: 'Dr. James Patterson',
          entityType: 'Individual',
          shares: 35,
          percentage: 35,
          acquisitionDate: '2018-09-25',
          nationality: 'Australian',
          amlScreening: {
            name: 'Dr. James Patterson',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-03-15',
            redFlags: []
          }
        }
      ]
    },
    {
      id: 're-003-3',
      entityName: 'Patterson Property Trust',
      relationship: 'Shareholder',
      personName: 'Dr. James Patterson',
      ownershipPercentage: 100,
      directorshipActive: false,
      entityType: 'Trust',
      jurisdiction: 'Victoria, Australia',
      industry: 'Real Estate Investment',
      registrationDate: '2010-06-18',
      status: 'Active',
      riskRating: 'Low',
      adverseFindings: [],
      annualRevenue: 'Not Disclosed',
      lastUpdated: '2026-02-10',
      directors: [],
      shareholders: [
        {
          name: 'Dr. James Patterson',
          entityType: 'Individual',
          shares: 100,
          percentage: 100,
          acquisitionDate: '2010-06-18',
          nationality: 'Australian',
          amlScreening: {
            name: 'Dr. James Patterson',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-02-10',
            redFlags: []
          }
        }
      ]
    }
  ],

  // Global Trade Solutions Ltd
  'client-004': [
    {
      id: 're-004-1',
      entityName: 'Eastern Trading Co. Ltd',
      relationship: 'Both',
      personName: 'Viktor Petrov',
      ownershipPercentage: 85,
      directorshipActive: true,
      entityType: 'Foreign Entity',
      jurisdiction: 'British Virgin Islands',
      industry: 'Import/Export',
      registrationNumber: 'BVI-2022-12345',
      registrationDate: '2022-05-10',
      status: 'Active',
      riskRating: 'Critical',
      adverseFindings: [
        'UBO is on OFAC sanctions list',
        'Suspected shell company',
        'No physical office presence verified',
        'Minimal business activity recorded'
      ],
      annualRevenue: 'Unknown',
      lastUpdated: '2026-03-21',
      directors: [
        {
          name: 'Viktor Petrov',
          appointedDate: '2022-05-10',
          status: 'Active',
          nationality: 'Russian',
          role: 'Director',
          amlScreening: {
            name: 'Viktor Petrov',
            sanctionsMatches: 1,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Critical',
            lastScreened: '2026-03-21',
            redFlags: ['UBO is on OFAC sanctions list']
          }
        }
      ],
      shareholders: [
        {
          name: 'Viktor Petrov',
          entityType: 'Individual',
          shares: 85,
          percentage: 85,
          acquisitionDate: '2022-05-10',
          nationality: 'Russian',
          amlScreening: {
            name: 'Viktor Petrov',
            sanctionsMatches: 1,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Critical',
            lastScreened: '2026-03-21',
            redFlags: ['UBO is on OFAC sanctions list']
          }
        }
      ]
    },
    {
      id: 're-004-2',
      entityName: 'Pacific Commodities Group Ltd',
      relationship: 'Shareholder',
      personName: 'Viktor Petrov',
      ownershipPercentage: 60,
      directorshipActive: false,
      entityType: 'Foreign Entity',
      jurisdiction: 'Cyprus',
      industry: 'Commodities Trading',
      registrationNumber: 'CY-2021-67890',
      registrationDate: '2021-11-22',
      status: 'Active',
      riskRating: 'Critical',
      adverseFindings: [
        'Linked to sanctioned Russian entities',
        'Subject to EU investigation',
        'Multiple ownership layers obscuring UBOs'
      ],
      annualRevenue: 'Unknown',
      lastUpdated: '2026-03-20',
      directors: [],
      shareholders: [
        {
          name: 'Viktor Petrov',
          entityType: 'Individual',
          shares: 60,
          percentage: 60,
          acquisitionDate: '2021-11-22',
          nationality: 'Russian',
          amlScreening: {
            name: 'Viktor Petrov',
            sanctionsMatches: 1,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Critical',
            lastScreened: '2026-03-20',
            redFlags: ['Linked to sanctioned Russian entities']
          }
        }
      ]
    },
    {
      id: 're-004-3',
      entityName: 'International Logistics Solutions Pty Ltd',
      relationship: 'Director',
      personName: 'Anna Kowalski',
      ownershipPercentage: 30,
      directorshipActive: true,
      entityType: 'Company',
      jurisdiction: 'Victoria, Australia',
      industry: 'Logistics & Freight',
      registrationNumber: 'ACN 234 567 891',
      registrationDate: '2023-02-15',
      status: 'Active',
      riskRating: 'High',
      adverseFindings: [
        'Customs investigation for misdeclared goods (ongoing)',
        'ABF compliance review in progress'
      ],
      annualRevenue: '$3M - $6M',
      employees: '10-15',
      lastUpdated: '2026-03-18',
      directors: [
        {
          name: 'Anna Kowalski',
          appointedDate: '2023-02-15',
          status: 'Active',
          nationality: 'Polish',
          role: 'Director',
          amlScreening: {
            name: 'Anna Kowalski',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'High',
            lastScreened: '2026-03-18',
            redFlags: ['Customs investigation for misdeclared goods (ongoing)']
          }
        }
      ],
      shareholders: [
        {
          name: 'Anna Kowalski',
          entityType: 'Individual',
          shares: 30,
          percentage: 30,
          acquisitionDate: '2023-02-15',
          nationality: 'Polish',
          amlScreening: {
            name: 'Anna Kowalski',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'High',
            lastScreened: '2026-03-18',
            redFlags: ['Customs investigation for misdeclared goods (ongoing)']
          }
        }
      ]
    },
    {
      id: 're-004-4',
      entityName: 'Chen Import Export (Shanghai) Co. Ltd',
      relationship: 'Both',
      personName: 'Chen Wei',
      ownershipPercentage: 55,
      directorshipActive: true,
      entityType: 'Foreign Entity',
      jurisdiction: 'China (Shanghai)',
      industry: 'Import/Export',
      registrationNumber: 'CN-310000-2020-45678',
      registrationDate: '2020-03-08',
      status: 'Active',
      riskRating: 'High',
      adverseFindings: [
        'Family member is PEP in Chinese government',
        'Subject to enhanced due diligence requirements'
      ],
      annualRevenue: 'Unknown',
      employees: 'Unknown',
      lastUpdated: '2026-03-15',
      directors: [
        {
          name: 'Chen Wei',
          appointedDate: '2020-03-08',
          status: 'Active',
          nationality: 'Chinese',
          role: 'Director',
          amlScreening: {
            name: 'Chen Wei',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'High',
            lastScreened: '2026-03-15',
            redFlags: ['Family member is PEP in Chinese government']
          }
        }
      ],
      shareholders: [
        {
          name: 'Chen Wei',
          entityType: 'Individual',
          shares: 55,
          percentage: 55,
          acquisitionDate: '2020-03-08',
          nationality: 'Chinese',
          amlScreening: {
            name: 'Chen Wei',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'High',
            lastScreened: '2026-03-15',
            redFlags: ['Family member is PEP in Chinese government']
          }
        }
      ]
    },
    {
      id: 're-004-5',
      entityName: 'Offshore Holdings BVI Ltd',
      relationship: 'Shareholder',
      personName: 'Viktor Petrov',
      ownershipPercentage: 100,
      directorshipActive: false,
      entityType: 'Foreign Entity',
      jurisdiction: 'British Virgin Islands',
      industry: 'Holding Company',
      registrationNumber: 'BVI-2021-98765',
      registrationDate: '2021-08-30',
      status: 'Active',
      riskRating: 'Critical',
      adverseFindings: [
        'Shell company - no employees',
        'UBO on multiple sanctions lists',
        'Used to obscure beneficial ownership',
        'Flagged by FinCEN',
        'Subject to asset freeze orders'
      ],
      annualRevenue: 'None',
      lastUpdated: '2026-03-21',
      directors: [],
      shareholders: [
        {
          name: 'Viktor Petrov',
          entityType: 'Individual',
          shares: 100,
          percentage: 100,
          acquisitionDate: '2021-08-30',
          nationality: 'Russian',
          amlScreening: {
            name: 'Viktor Petrov',
            sanctionsMatches: 1,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Critical',
            lastScreened: '2026-03-21',
            redFlags: ['UBO on multiple sanctions lists']
          }
        }
      ]
    },
    {
      id: 're-004-6',
      entityName: 'TransGlobal Shipping Ltd',
      relationship: 'Director',
      personName: 'Anna Kowalski',
      ownershipPercentage: 25,
      directorshipActive: true,
      entityType: 'Company',
      jurisdiction: 'New South Wales, Australia',
      industry: 'Maritime Shipping',
      registrationNumber: 'ACN 345 678 902',
      registrationDate: '2022-07-18',
      status: 'Active',
      riskRating: 'High',
      adverseFindings: [
        'Vessel detained by Border Force (2025)',
        'AMSA safety violations recorded'
      ],
      annualRevenue: '$5M - $10M',
      employees: '20-30',
      lastUpdated: '2026-03-12',
      directors: [
        {
          name: 'Anna Kowalski',
          appointedDate: '2022-07-18',
          status: 'Active',
          nationality: 'Polish',
          role: 'Director',
          amlScreening: {
            name: 'Anna Kowalski',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'High',
            lastScreened: '2026-03-12',
            redFlags: ['Vessel detained by Border Force (2025)']
          }
        }
      ],
      shareholders: [
        {
          name: 'Anna Kowalski',
          entityType: 'Individual',
          shares: 25,
          percentage: 25,
          acquisitionDate: '2022-07-18',
          nationality: 'Polish',
          amlScreening: {
            name: 'Anna Kowalski',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'High',
            lastScreened: '2026-03-12',
            redFlags: ['Vessel detained by Border Force (2025)']
          }
        }
      ]
    }
  ],

  // Anderson & Partners LLP
  'client-005': [
    {
      id: 're-005-1',
      entityName: 'Anderson Legal Consulting Pty Ltd',
      relationship: 'Both',
      personName: 'Jennifer Anderson',
      ownershipPercentage: 100,
      directorshipActive: true,
      entityType: 'Company',
      jurisdiction: 'Victoria, Australia',
      industry: 'Legal Consulting',
      registrationNumber: 'ACN 456 789 013',
      registrationDate: '2016-08-20',
      status: 'Active',
      riskRating: 'Low',
      adverseFindings: [],
      annualRevenue: '$400K - $800K',
      employees: '2-3',
      lastUpdated: '2026-03-05',
      directors: [
        {
          name: 'Jennifer Anderson',
          appointedDate: '2016-08-20',
          status: 'Active',
          nationality: 'Australian',
          role: 'Director',
          amlScreening: {
            name: 'Jennifer Anderson',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-03-05',
            redFlags: []
          }
        }
      ],
      shareholders: [
        {
          name: 'Jennifer Anderson',
          entityType: 'Individual',
          shares: 100,
          percentage: 100,
          acquisitionDate: '2016-08-20',
          nationality: 'Australian',
          amlScreening: {
            name: 'Jennifer Anderson',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-03-05',
            redFlags: []
          }
        }
      ]
    },
    {
      id: 're-005-2',
      entityName: 'O\'Brien & Associates Pty Ltd',
      relationship: 'Both',
      personName: 'Michael O\'Brien',
      ownershipPercentage: 80,
      directorshipActive: true,
      entityType: 'Company',
      jurisdiction: 'Queensland, Australia',
      industry: 'Legal Services',
      registrationNumber: 'ACN 567 890 124',
      registrationDate: '2014-11-15',
      status: 'Active',
      riskRating: 'Low',
      adverseFindings: [],
      annualRevenue: '$600K - $1.2M',
      employees: '4-6',
      lastUpdated: '2026-02-28',
      directors: [
        {
          name: 'Michael O\'Brien',
          appointedDate: '2014-11-15',
          status: 'Active',
          nationality: 'Australian',
          role: 'Director',
          amlScreening: {
            name: 'Michael O\'Brien',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-02-28',
            redFlags: []
          }
        }
      ],
      shareholders: [
        {
          name: 'Michael O\'Brien',
          entityType: 'Individual',
          shares: 80,
          percentage: 80,
          acquisitionDate: '2014-11-15',
          nationality: 'Australian',
          amlScreening: {
            name: 'Michael O\'Brien',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-02-28',
            redFlags: []
          }
        }
      ]
    },
    {
      id: 're-005-3',
      entityName: 'Thompson Family Trust',
      relationship: 'Shareholder',
      personName: 'Sarah Thompson',
      ownershipPercentage: 100,
      directorshipActive: false,
      entityType: 'Trust',
      jurisdiction: 'New South Wales, Australia',
      industry: 'Investment & Wealth Management',
      registrationDate: '2018-03-10',
      status: 'Active',
      riskRating: 'Low',
      adverseFindings: [],
      annualRevenue: 'Not Disclosed',
      lastUpdated: '2026-03-01',
      directors: [],
      shareholders: [
        {
          name: 'Sarah Thompson',
          entityType: 'Individual',
          shares: 100,
          percentage: 100,
          acquisitionDate: '2018-03-10',
          nationality: 'Australian',
          amlScreening: {
            name: 'Sarah Thompson',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-03-01',
            redFlags: []
          }
        }
      ]
    },
    {
      id: 're-005-4',
      entityName: 'Legal Innovation Hub Pty Ltd',
      relationship: 'Shareholder',
      personName: 'David Chang',
      ownershipPercentage: 40,
      directorshipActive: false,
      entityType: 'Company',
      jurisdiction: 'Victoria, Australia',
      industry: 'Legal Technology',
      registrationNumber: 'ACN 678 901 235',
      registrationDate: '2021-06-05',
      status: 'Active',
      riskRating: 'Low',
      adverseFindings: [],
      annualRevenue: '$800K - $1.5M',
      employees: '8-12',
      lastUpdated: '2026-03-10',
      directors: [],
      shareholders: [
        {
          name: 'David Chang',
          entityType: 'Individual',
          shares: 40,
          percentage: 40,
          acquisitionDate: '2021-06-05',
          nationality: 'Australian',
          amlScreening: {
            name: 'David Chang',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-03-10',
            redFlags: []
          }
        }
      ]
    },
    {
      id: 're-005-5',
      entityName: 'Professional Services Alliance Ltd',
      relationship: 'Director',
      personName: 'Jennifer Anderson',
      ownershipPercentage: 30,
      directorshipActive: true,
      entityType: 'Company',
      jurisdiction: 'Victoria, Australia',
      industry: 'Business Services',
      registrationNumber: 'ACN 789 012 346',
      registrationDate: '2019-09-12',
      status: 'Active',
      riskRating: 'Low',
      adverseFindings: [],
      annualRevenue: '$2M - $4M',
      employees: '15-20',
      lastUpdated: '2026-02-20',
      directors: [
        {
          name: 'Jennifer Anderson',
          appointedDate: '2019-09-12',
          status: 'Active',
          nationality: 'Australian',
          role: 'Director',
          amlScreening: {
            name: 'Jennifer Anderson',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-02-20',
            redFlags: []
          }
        }
      ],
      shareholders: [
        {
          name: 'Jennifer Anderson',
          entityType: 'Individual',
          shares: 30,
          percentage: 30,
          acquisitionDate: '2019-09-12',
          nationality: 'Australian',
          amlScreening: {
            name: 'Jennifer Anderson',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-02-20',
            redFlags: []
          }
        }
      ]
    }
  ],

  // Pacific Investment Holdings Pte Ltd
  'client-006': [
    {
      id: 're-006-1',
      entityName: 'Tan Family Holdings Pte Ltd',
      relationship: 'Both',
      personName: 'Lawrence Tan',
      ownershipPercentage: 75,
      directorshipActive: true,
      entityType: 'Foreign Entity',
      jurisdiction: 'Singapore',
      industry: 'Investment Holding',
      registrationNumber: 'SG-201512345B',
      registrationDate: '2015-03-20',
      status: 'Active',
      riskRating: 'Medium',
      adverseFindings: ['UBO is former PEP - enhanced monitoring required'],
      annualRevenue: 'Unknown',
      lastUpdated: '2026-03-18',
      directors: [
        {
          name: 'Lawrence Tan',
          appointedDate: '2015-03-20',
          status: 'Active',
          nationality: 'Singaporean',
          role: 'Director',
          amlScreening: {
            name: 'Lawrence Tan',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Medium',
            lastScreened: '2026-03-18',
            redFlags: ['UBO is former PEP - enhanced monitoring required']
          }
        }
      ],
      shareholders: [
        {
          name: 'Lawrence Tan',
          entityType: 'Individual',
          shares: 75,
          percentage: 75,
          acquisitionDate: '2015-03-20',
          nationality: 'Singaporean',
          amlScreening: {
            name: 'Lawrence Tan',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Medium',
            lastScreened: '2026-03-18',
            redFlags: ['UBO is former PEP - enhanced monitoring required']
          }
        }
      ]
    },
    {
      id: 're-006-2',
      entityName: 'Asian Growth Fund Ltd',
      relationship: 'Director',
      personName: 'Lawrence Tan',
      ownershipPercentage: 28,
      directorshipActive: true,
      entityType: 'Foreign Entity',
      jurisdiction: 'Cayman Islands',
      industry: 'Investment Fund',
      registrationNumber: 'KY-2017-67890',
      registrationDate: '2017-11-08',
      status: 'Active',
      riskRating: 'Medium',
      adverseFindings: ['Offshore jurisdiction - enhanced transparency required'],
      annualRevenue: 'Unknown',
      lastUpdated: '2026-03-12',
      directors: [
        {
          name: 'Lawrence Tan',
          appointedDate: '2017-11-08',
          status: 'Active',
          nationality: 'Singaporean',
          role: 'Director',
          amlScreening: {
            name: 'Lawrence Tan',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Medium',
            lastScreened: '2026-03-12',
            redFlags: ['Offshore jurisdiction - enhanced transparency required']
          }
        }
      ],
      shareholders: [
        {
          name: 'Lawrence Tan',
          entityType: 'Individual',
          shares: 28,
          percentage: 28,
          acquisitionDate: '2017-11-08',
          nationality: 'Singaporean',
          amlScreening: {
            name: 'Lawrence Tan',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Medium',
            lastScreened: '2026-03-12',
            redFlags: ['Offshore jurisdiction - enhanced transparency required']
          }
        }
      ]
    },
    {
      id: 're-006-3',
      entityName: 'Strategic Partners (HK) Ltd',
      relationship: 'Shareholder',
      personName: 'Lawrence Tan',
      ownershipPercentage: 45,
      directorshipActive: false,
      entityType: 'Foreign Entity',
      jurisdiction: 'Hong Kong',
      industry: 'Investment Management',
      registrationNumber: 'HK-2016-12345',
      registrationDate: '2016-06-22',
      status: 'Active',
      riskRating: 'Medium',
      adverseFindings: ['Complex ownership structure spanning multiple jurisdictions'],
      annualRevenue: 'Unknown',
      lastUpdated: '2026-03-10',
      directors: [],
      shareholders: [
        {
          name: 'Lawrence Tan',
          entityType: 'Individual',
          shares: 45,
          percentage: 45,
          acquisitionDate: '2016-06-22',
          nationality: 'Singaporean',
          amlScreening: {
            name: 'Lawrence Tan',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Medium',
            lastScreened: '2026-03-10',
            redFlags: ['Complex ownership structure spanning multiple jurisdictions']
          }
        }
      ]
    },
    {
      id: 're-006-4',
      entityName: 'Sharma Consulting Services Pte Ltd',
      relationship: 'Both',
      personName: 'Priya Sharma',
      ownershipPercentage: 60,
      directorshipActive: true,
      entityType: 'Foreign Entity',
      jurisdiction: 'Singapore',
      industry: 'Business Consulting',
      registrationNumber: 'SG-201823456C',
      registrationDate: '2018-04-15',
      status: 'Active',
      riskRating: 'Low',
      adverseFindings: [],
      annualRevenue: 'SGD 1M - 2M',
      employees: '5-8',
      lastUpdated: '2026-03-08',
      directors: [
        {
          name: 'Priya Sharma',
          appointedDate: '2018-04-15',
          status: 'Active',
          nationality: 'Indian',
          role: 'Director',
          amlScreening: {
            name: 'Priya Sharma',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-03-08',
            redFlags: []
          }
        }
      ],
      shareholders: [
        {
          name: 'Priya Sharma',
          entityType: 'Individual',
          shares: 60,
          percentage: 60,
          acquisitionDate: '2018-04-15',
          nationality: 'Indian',
          amlScreening: {
            name: 'Priya Sharma',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-03-08',
            redFlags: []
          }
        }
      ]
    },
    {
      id: 're-006-5',
      entityName: 'Pacific Real Estate Development Ltd',
      relationship: 'Shareholder',
      personName: 'Lawrence Tan',
      ownershipPercentage: 35,
      directorshipActive: false,
      entityType: 'Foreign Entity',
      jurisdiction: 'Singapore',
      industry: 'Real Estate Development',
      registrationNumber: 'SG-201934567D',
      registrationDate: '2019-08-30',
      status: 'Active',
      riskRating: 'Medium',
      adverseFindings: ['Related party transactions with Tan Family entities require disclosure'],
      annualRevenue: 'SGD 15M - 30M',
      employees: '30-40',
      lastUpdated: '2026-02-25',
      directors: [],
      shareholders: [
        {
          name: 'Lawrence Tan',
          entityType: 'Individual',
          shares: 35,
          percentage: 35,
          acquisitionDate: '2019-08-30',
          nationality: 'Singaporean',
          amlScreening: {
            name: 'Lawrence Tan',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Medium',
            lastScreened: '2026-02-25',
            redFlags: ['Related party transactions with Tan Family entities require disclosure']
          }
        }
      ]
    },
    {
      id: 're-006-6',
      entityName: 'Global Opportunities Fund Pty Ltd',
      relationship: 'Director',
      personName: 'Priya Sharma',
      ownershipPercentage: 25,
      directorshipActive: true,
      entityType: 'Company',
      jurisdiction: 'Victoria, Australia',
      industry: 'Investment Management',
      registrationNumber: 'ACN 890 123 457',
      registrationDate: '2020-10-12',
      status: 'Active',
      riskRating: 'Low',
      adverseFindings: [],
      annualRevenue: '$3M - $6M',
      employees: '8-12',
      lastUpdated: '2026-03-15',
      directors: [
        {
          name: 'Priya Sharma',
          appointedDate: '2020-10-12',
          status: 'Active',
          nationality: 'Indian',
          role: 'Director',
          amlScreening: {
            name: 'Priya Sharma',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-03-15',
            redFlags: []
          }
        }
      ],
      shareholders: [
        {
          name: 'Priya Sharma',
          entityType: 'Individual',
          shares: 25,
          percentage: 25,
          acquisitionDate: '2020-10-12',
          nationality: 'Indian',
          amlScreening: {
            name: 'Priya Sharma',
            sanctionsMatches: 0,
            pepStatus: 'Not PEP',
            adverseMediaHits: 0,
            riskRating: 'Low',
            lastScreened: '2026-03-15',
            redFlags: []
          }
        }
      ]
    }
  ]
};