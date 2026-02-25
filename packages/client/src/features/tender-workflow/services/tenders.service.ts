import type { Tender, TenderFormData, TenderStatus } from '../types/tender.types';

// Mock data for tenders (uses extended shape; cast to Tender for service compatibility)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockTenders: Tender[] = ([
  {
    id: '1',
    name: 'Supply of Office Furniture and Equipment',
    referenceNumber: 'REF/2026/001',
    issuingDepartment: 'Administration Department',
    description: 'Requirement for supply and installation of office furniture including desks, chairs, filing cabinets, and other office equipment for the new office building.',
    tags: [{ id: 't1', name: 'Furniture', color: '#1677ff' }, { id: 't2', name: 'Equipment', color: '#52c41a' }, { id: 't3', name: 'Office', color: '#faad14' }],
    status: 'DRAFT' as TenderStatus,
    documents: [],
    createdAt: new Date('2025-12-20'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: '2',
    name: 'IT Infrastructure Upgrade Services',
    referenceNumber: 'REF/2026/002',
    issuingDepartment: 'IT Department',
    description: 'Comprehensive IT infrastructure upgrade including network equipment, servers, security systems, and implementation services.',
    tags: [{ id: 't4', name: 'IT', color: '#1677ff' }, { id: 't5', name: 'Networking', color: '#52c41a' }, { id: 't6', name: 'Security', color: '#f5222d' }, { id: 't7', name: 'Servers', color: '#722ed1' }],
    status: 'MD_TAGGED' as TenderStatus,
    documents: [],
    createdAt: new Date('2025-12-25'),
    updatedAt: new Date('2026-01-10'),
  },
  {
    id: '3',
    name: 'Annual Maintenance Contract for HVAC Systems',
    referenceNumber: 'REF/2026/003',
    issuingDepartment: 'Facilities Management',
    description: 'Annual maintenance contract for all HVAC systems across multiple office locations including preventive and breakdown maintenance.',
    tags: [{ id: 't8', name: 'HVAC', color: '#13c2c2' }, { id: 't9', name: 'Maintenance', color: '#52c41a' }, { id: 't10', name: 'AMC', color: '#fa8c16' }],
    status: 'MAIL_SENT' as TenderStatus,
    documents: [],
    createdAt: new Date('2025-12-10'),
    updatedAt: new Date('2026-01-25'),
  },
  {
    id: '4',
    name: 'Construction of New Warehouse Facility',
    referenceNumber: 'REF/2026/004',
    issuingDepartment: 'Infrastructure Development',
    description: 'Design, construction, and commissioning of a new 50,000 sq ft warehouse facility with modern storage systems and loading bays.',
    tags: [{ id: 't11', name: 'Construction', color: '#d48806' }, { id: 't12', name: 'Warehouse', color: '#08979c' }, { id: 't13', name: 'Civil Works', color: '#389e0d' }],
    status: 'DRAFT' as TenderStatus,
    documents: [],
    createdAt: new Date('2026-01-02'),
    updatedAt: new Date('2026-01-03'),
  },
  {
    id: '5',
    name: 'Supply of Stationery Items',
    referenceNumber: 'REF/2026/005',
    issuingDepartment: 'Administration Department',
    description: 'Annual rate contract for supply of various stationery items including paper, pens, files, and other office consumables.',
    tags: [{ id: 't14', name: 'Stationery', color: '#1677ff' }, { id: 't15', name: 'Office', color: '#faad14' }, { id: 't16', name: 'Consumables', color: '#52c41a' }],
    status: 'DRAFT' as TenderStatus,
    documents: [],
    createdAt: new Date('2025-12-28'),
    updatedAt: new Date('2026-01-02'),
  },
] as unknown) as Tender[];

// In-memory storage
let tenders: Tender[] = [...mockTenders];
let nextId = 6;

export const tendersService = {
  // Get all tenders
  getAllTenders: async (): Promise<Tender[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...tenders]);
      }, 300);
    });
  },

  // Get tender by ID
  getTenderById: async (id: string): Promise<Tender | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tender = tenders.find((t) => t.id === id);
        resolve(tender || null);
      }, 300);
    });
  },

  // Create new tender
  createTender: async (data: TenderFormData): Promise<Tender> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTender: Tender = {
          ...data,
          id: String(nextId),
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
  updateTender: async (id: string, data: Partial<TenderFormData>): Promise<Tender | null> => {
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
  updateTenderStatus: async (id: string, status: TenderStatus): Promise<Tender | null> => {
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
