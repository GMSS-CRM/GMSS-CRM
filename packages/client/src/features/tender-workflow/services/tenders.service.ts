// Using a local mock type in this service - do not import application Tender types here

// Mock data for tenders
// Local mock tender shape (matches the mock data used here)
type MockTender = {
  id: string;
  tenderId: string;
  title: string;
  referenceNumber: string;
  issuingDepartment: string;
  tenderType?: string;
  description?: string;
  estimatedValue?: number;
  categories?: string[];
  tags: string[];
  allowedVendorTypes?: string[];
  mandatoryDocuments?: string[];
  minimumExperience?: number;
  publishDate?: Date;
  submissionStartDate?: Date;
  submissionEndDate?: Date;
  closingDate?: Date;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
};

// Mock data for tenders
const mockTenders: MockTender[] = [
  {
    id: '1',
    tenderId: 'TND-0001',
    title: 'Supply of Office Furniture and Equipment',
    referenceNumber: 'REF/2026/001',
    issuingDepartment: 'Administration Department',
    tenderType: 'goods',
    description: 'Requirement for supply and installation of office furniture including desks, chairs, filing cabinets, and other office equipment for the new office building.',
    estimatedValue: 5000000,
    categories: ['Furniture', 'Office Supplies'],
    tags: ['Furniture', 'Equipment', 'Office'],
    allowedVendorTypes: ['oem', 'trader'],
    mandatoryDocuments: ['gst', 'pan', 'msme'],
    minimumExperience: 5,
    publishDate: new Date('2026-01-01'),
    submissionStartDate: new Date('2026-01-05'),
    submissionEndDate: new Date('2026-02-05'),
    closingDate: new Date('2026-02-10'),
    status: 'published',
    createdAt: new Date('2025-12-20'),
    updatedAt: new Date('2026-01-01'),
    createdBy: 'admin@example.com',
  },
  {
    id: '2',
    tenderId: 'TND-0002',
    title: 'IT Infrastructure Upgrade Services',
    referenceNumber: 'REF/2026/002',
    issuingDepartment: 'IT Department',
    tenderType: 'services',
    description: 'Comprehensive IT infrastructure upgrade including network equipment, servers, security systems, and implementation services.',
    estimatedValue: 15000000,
    categories: ['IT Services', 'Infrastructure'],
    tags: ['IT', 'Networking', 'Security', 'Servers'],
    allowedVendorTypes: ['oem', 'trader'],
    mandatoryDocuments: ['gst', 'pan'],
    minimumExperience: 10,
    publishDate: new Date('2026-01-10'),
    submissionStartDate: new Date('2026-01-15'),
    submissionEndDate: new Date('2026-02-15'),
    closingDate: new Date('2026-02-20'),
    status: 'published',
    createdAt: new Date('2025-12-25'),
    updatedAt: new Date('2026-01-10'),
    createdBy: 'admin@example.com',
  },
  {
    id: '3',
    tenderId: 'TND-0003',
    title: 'Annual Maintenance Contract for HVAC Systems',
    referenceNumber: 'REF/2026/003',
    issuingDepartment: 'Facilities Management',
    tenderType: 'services',
    description: 'Annual maintenance contract for all HVAC systems across multiple office locations including preventive and breakdown maintenance.',
    estimatedValue: 2000000,
    categories: ['Maintenance', 'HVAC'],
    tags: ['HVAC', 'Maintenance', 'AMC'],
    allowedVendorTypes: ['oem', 'trader', 'distributor'],
    mandatoryDocuments: ['gst', 'pan'],
    minimumExperience: 3,
    publishDate: new Date('2025-12-15'),
    submissionStartDate: new Date('2025-12-20'),
    submissionEndDate: new Date('2026-01-20'),
    closingDate: new Date('2026-01-25'),
    status: 'closed',
    createdAt: new Date('2025-12-10'),
    updatedAt: new Date('2026-01-25'),
    createdBy: 'admin@example.com',
  },
  {
    id: '4',
    tenderId: 'TND-0004',
    title: 'Construction of New Warehouse Facility',
    referenceNumber: 'REF/2026/004',
    issuingDepartment: 'Infrastructure Development',
    tenderType: 'works',
    description: 'Design, construction, and commissioning of a new 50,000 sq ft warehouse facility with modern storage systems and loading bays.',
    estimatedValue: 35000000,
    categories: ['Construction', 'Infrastructure'],
    tags: ['Construction', 'Warehouse', 'Civil Works'],
    allowedVendorTypes: ['oem'],
    mandatoryDocuments: ['gst', 'pan', 'msme'],
    minimumExperience: 15,
    status: 'draft',
    createdAt: new Date('2026-01-02'),
    updatedAt: new Date('2026-01-03'),
    createdBy: 'admin@example.com',
  },
  {
    id: '5',
    tenderId: 'TND-0005',
    title: 'Supply of Stationery Items',
    referenceNumber: 'REF/2026/005',
    issuingDepartment: 'Administration Department',
    tenderType: 'goods',
    description: 'Annual rate contract for supply of various stationery items including paper, pens, files, and other office consumables.',
    estimatedValue: 500000,
    categories: ['Office Supplies', 'Stationery'],
    tags: ['Stationery', 'Office', 'Consumables'],
    allowedVendorTypes: ['trader', 'distributor'],
    mandatoryDocuments: ['gst', 'pan'],
    minimumExperience: 2,
    status: 'draft',
    createdAt: new Date('2025-12-28'),
    updatedAt: new Date('2026-01-02'),
    createdBy: 'admin@example.com',
  },
];

// In-memory storage
let tenders: MockTender[] = [...mockTenders];
let nextId = 6;

export const tendersService = {
  // Get all tenders
  getAllTenders: async (): Promise<MockTender[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...tenders]);
      }, 300);
    });
  },

  // Get tender by ID
  getTenderById: async (id: string): Promise<MockTender | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tender = tenders.find((t) => t.id === id);
        resolve(tender || null);
      }, 300);
    });
  },

  // Create new tender
  createTender: async (data: any): Promise<MockTender> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTender: MockTender = {
          ...data,
          id: String(nextId),
          tenderId: `TND-${String(nextId).padStart(4, '0')}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        nextId++;
        tenders.push(newTender);
        resolve(newTender);
      }, 300);
    });
  },

  // Update tender
  updateTender: async (id: string, data: Partial<any>): Promise<MockTender | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = tenders.findIndex((t) => t.id === id);
        if (index !== -1) {
          tenders[index] = {
            ...tenders[index],
            ...data,
            updatedAt: new Date(),
          };
          resolve(tenders[index]);
        } else {
          resolve(null);
        }
      }, 300);
    });
  },

  // Update tender status
  updateTenderStatus: async (id: string, status: string): Promise<MockTender | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = tenders.findIndex((t) => t.id === id);
        if (index !== -1) {
          tenders[index] = {
            ...tenders[index],
            status,
            updatedAt: new Date(),
          };
          resolve(tenders[index]);
        } else {
          resolve(null);
        }
      }, 300);
    });
  },

  // Delete tender
  deleteTender: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = tenders.findIndex((t) => t.id === id);
        if (index !== -1) {
          tenders.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  },
};
