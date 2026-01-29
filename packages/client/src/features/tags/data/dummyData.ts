import type { TagVendorDisplay, TagWithVendorCount } from '../types/tagTypes';
// Dummy Tags
export const dummyTags: TagWithVendorCount[] = [
  {
    id: '1',
    name: 'Electronics',
    createdBy: 'admin@gmss.com',
    updatedBy: 'admin@gmss.com',
    createdDate: '2024-01-15T10:30:00.000Z',
    updatedDate: '2024-01-15T10:30:00.000Z',
    vendorCount: 25,
    enabledMailCount: 22,
  },
  {
    id: '2',
    name: 'IT Services',
    createdBy: 'admin@gmss.com',
    updatedBy: 'admin@gmss.com',
    createdDate: '2024-01-10T09:15:00.000Z',
    updatedDate: '2024-01-12T14:20:00.000Z',
    vendorCount: 42,
    enabledMailCount: 38,
  },
  {
    id: '3',
    name: 'Construction',
    createdBy: 'manager@gmss.com',
    createdDate: '2024-01-08T11:45:00.000Z',
    updatedDate: '2024-01-08T11:45:00.000Z',
    vendorCount: 18,
    enabledMailCount: 18,
  },
  {
    id: '4',
    name: 'Office Supplies',
    createdBy: 'admin@gmss.com',
    createdDate: '2024-01-05T08:00:00.000Z',
    updatedDate: '2024-01-05T08:00:00.000Z',
    vendorCount: 31,
    enabledMailCount: 28,
  },
  {
    id: '5',
    name: 'Consulting',
    createdBy: 'admin@gmss.com',
    createdDate: '2024-01-03T16:30:00.000Z',
    updatedDate: '2024-01-03T16:30:00.000Z',
    vendorCount: 0,
    enabledMailCount: 0,
  },
  {
    id: '6',
    name: 'Logistics',
    createdBy: 'manager@gmss.com',
    createdDate: '2024-01-02T13:00:00.000Z',
    updatedDate: '2024-01-02T13:00:00.000Z',
    vendorCount: 15,
    enabledMailCount: 15,
  },
  {
    id: '7',
    name: 'Healthcare',
    createdBy: 'admin@gmss.com',
    createdDate: '2024-01-01T10:00:00.000Z',
    updatedDate: '2024-01-01T10:00:00.000Z',
    vendorCount: 8,
    enabledMailCount: 6,
  },
  {
    id: '8',
    name: 'Marketing',
    createdBy: 'admin@gmss.com',
    createdDate: '2023-12-28T09:00:00.000Z',
    updatedDate: '2023-12-28T09:00:00.000Z',
    vendorCount: 12,
    enabledMailCount: 10,
  },
];

// Dummy Vendors for Tags
export const dummyTagVendors: Record<string, TagVendorDisplay[]> = {
  '1': [ // Electronics
    { id: 'vt1', vendorId: 'v1', vendorName: 'TechCorp Solutions', vendorEmail: 'contact@techcorp.com', enableMail: true },
    { id: 'vt2', vendorId: 'v2', vendorName: 'ElectroHub Ltd', vendorEmail: 'sales@electrohub.com', enableMail: true },
    { id: 'vt3', vendorId: 'v3', vendorName: 'Circuit Systems', vendorEmail: 'info@circuitsys.com', enableMail: false },
    { id: 'vt4', vendorId: 'v4', vendorName: 'Digital Dynamics', vendorEmail: 'hello@digitaldyn.com', enableMail: true },
    { id: 'vt5', vendorId: 'v5', vendorName: 'Gadget World', vendorEmail: 'support@gadgetworld.com', enableMail: true },
  ],
  '2': [ // IT Services
    { id: 'vt6', vendorId: 'v6', vendorName: 'CloudNet Services', vendorEmail: 'info@cloudnet.com', enableMail: true },
    { id: 'vt7', vendorId: 'v7', vendorName: 'DataSoft Inc', vendorEmail: 'contact@datasoft.com', enableMail: true },
    { id: 'vt8', vendorId: 'v8', vendorName: 'NetSecure Pro', vendorEmail: 'sales@netsecure.com', enableMail: false },
    { id: 'vt9', vendorId: 'v9', vendorName: 'CodeCraft Labs', vendorEmail: 'hello@codecraft.com', enableMail: true },
  ],
  '3': [ // Construction
    { id: 'vt10', vendorId: 'v10', vendorName: 'BuildRight Co', vendorEmail: 'info@buildright.com', enableMail: true },
    { id: 'vt11', vendorId: 'v11', vendorName: 'Steel & Stone Ltd', vendorEmail: 'contact@steelstone.com', enableMail: true },
    { id: 'vt12', vendorId: 'v12', vendorName: 'Foundation First', vendorEmail: 'sales@foundationfirst.com', enableMail: true },
  ],
  '4': [ // Office Supplies
    { id: 'vt13', vendorId: 'v13', vendorName: 'OfficeMart', vendorEmail: 'orders@officemart.com', enableMail: true },
    { id: 'vt14', vendorId: 'v14', vendorName: 'Stationery Plus', vendorEmail: 'info@stationeryplus.com', enableMail: false },
  ],
  '5': [], // Consulting - empty
  '6': [ // Logistics
    { id: 'vt15', vendorId: 'v15', vendorName: 'FastFreight Inc', vendorEmail: 'dispatch@fastfreight.com', enableMail: true },
    { id: 'vt16', vendorId: 'v16', vendorName: 'Global Shipping Co', vendorEmail: 'info@globalship.com', enableMail: true },
  ],
  '7': [ // Healthcare
    { id: 'vt17', vendorId: 'v17', vendorName: 'MediSupply Corp', vendorEmail: 'orders@medisupply.com', enableMail: true },
    { id: 'vt18', vendorId: 'v18', vendorName: 'HealthTech Solutions', vendorEmail: 'contact@healthtech.com', enableMail: false },
  ],
  '8': [ // Marketing
    { id: 'vt19', vendorId: 'v19', vendorName: 'AdVenture Agency', vendorEmail: 'hello@adventure.com', enableMail: true },
    { id: 'vt20', vendorId: 'v20', vendorName: 'BrandBoost Inc', vendorEmail: 'info@brandboost.com', enableMail: true },
  ],
};

// Helper to simulate API delay
export const simulateDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));
