import type { Vendor, VendorDocument, Tag, VendorMdRequest, CompanyType } from '../types';

/**
 * Vendors Service
 * API integration layer for vendor management operations
 * TODO: Integrate with GraphQL/REST API
 */

// Mock Tags Data
export const MOCK_TAGS: Tag[] = [
  { id: '1', name: 'Electronics', color: 'blue' },
  { id: '2', name: 'Medical Equipment', color: 'green' },
  { id: '3', name: 'Construction', color: 'orange' },
  { id: '4', name: 'IT Services', color: 'purple' },
  { id: '5', name: 'Pharmaceuticals', color: 'red' },
  { id: '6', name: 'Industrial Machinery', color: 'cyan' },
];

// Mock Vendors Data — using CompanyStatus: New | Interested | Final
export const MOCK_VENDORS: Vendor[] = [
  {
    id: '1',
    vendorCode: 'VND-0001',
    companyName: 'TechCorp India Pvt Ltd',
    companyType: 'Vendor' as CompanyType,
    isLinkedWithRailways: true,
    address: '123 MG Road, Bangalore, Karnataka 560001',
    contactPersons: [
      {
        id: 'cp1',
        name: 'Rahul Mehta',
        designation: 'Sales Manager',
        phone: '+91 9876543210',
        email: {
          mailto: ['rahul.mehta@techcorp.in'],
          cc: [],
          bcc: [],
        },
      },
    ],
    gstNumber: '29ABCDE1234F1Z5',
    panNumber: 'ABCDE1234F',
    msmeNumber: 'UDYAM-KA-12-1234567',
    cinNumber: 'U72900KA2015PTC123456',
    tags: ['1', '4'],
    status: 'Final',
    createdDate: new Date('2024-01-15').toISOString(),
    createdBy: 'emp001',
    isDeleted: false,
  },
  {
    id: '2',
    vendorCode: 'VND-0002',
    companyName: 'MedEquip Solutions',
    companyType: 'Consultant' as CompanyType,
    isLinkedWithRailways: false,
    address: 'Plot 45, Industrial Area, Phase 2, Noida, UP 201301',
    contactPersons: [
      {
        id: 'cp2',
        name: 'Dr. Priya Sharma',
        designation: 'Technical Director',
        phone: '+91 9123456789',
        email: {
          mailto: ['priya@medequip.co.in'],
          cc: ['admin@medequip.co.in'],
          bcc: [],
        },
      },
    ],
    gstNumber: '09XYZAB5678G2Z1',
    panNumber: 'XYZAB5678G',
    msmeNumber: 'UDYAM-UP-09-2345678',
    tags: ['2', '5'],
    status: 'Interested',
    createdDate: new Date('2024-02-01').toISOString(),
    createdBy: 'emp001',
    updatedDate: new Date('2024-02-05').toISOString(),
    isDeleted: false,
  },
  {
    id: '3',
    vendorCode: 'VND-0003',
    companyName: 'Global Trade Partners',
    companyType: 'Vendor' as CompanyType,
    isLinkedWithRailways: true,
    address: '56 Nehru Place, New Delhi, Delhi 110019',
    contactPersons: [
      {
        id: 'cp3',
        name: 'Amit Kumar',
        designation: 'Business Development Manager',
        phone: '+91 9988776655',
        email: {
          mailto: ['amit@globaltp.com'],
          cc: [],
          bcc: [],
        },
      },
      {
        id: 'cp4',
        name: 'Sneha Gupta',
        designation: 'Operations Manager',
        phone: '+91 9876543211',
        email: {
          mailto: ['sneha@globaltp.com'],
          cc: ['amit@globaltp.com'],
          bcc: [],
        },
      },
    ],
    gstNumber: '07PQRST9012H3Z4',
    panNumber: 'PQRST9012H',
    tags: ['1', '3', '6'],
    status: 'New',
    createdDate: new Date('2024-03-10').toISOString(),
    createdBy: 'emp002',
    isDeleted: false,
  },
  {
    id: '4',
    vendorCode: 'VND-0004',
    companyName: 'Pharma Distributors Inc',
    companyType: 'Consultant' as CompanyType,
    isLinkedWithRailways: false,
    address: 'Tower B, Cyber City, Gurgaon, Haryana 122002',
    contactPersons: [
      {
        id: 'cp5',
        name: 'Anjali Verma',
        designation: 'Procurement Specialist',
        phone: '+91 9876012345',
        email: {
          mailto: ['anjali@pharmadist.in'],
          cc: ['support@pharmadist.in'],
          bcc: ['manager@pharmadist.in'],
        },
      },
    ],
    gstNumber: '06LMNOP3456I4Z9',
    panNumber: 'LMNOP3456I',
    tags: ['5'],
    status: 'New',
    createdDate: new Date('2024-03-20').toISOString(),
    createdBy: 'emp002',
    isDeleted: false,
  },
  {
    id: '5',
    vendorCode: 'VND-0005',
    companyName: 'Industrial Systems OEM',
    companyType: 'Vendor' as CompanyType,
    isLinkedWithRailways: true,
    address: 'MIDC Area, Pune, Maharashtra 411019',
    contactPersons: [
      {
        id: 'cp6',
        name: 'Vikram Patel',
        designation: 'CEO',
        phone: '+91 9123987654',
        email: {
          mailto: ['vikram@industrialoem.com'],
          cc: [],
          bcc: [],
        },
      },
    ],
    gstNumber: '27FGHIJ6789K5Z2',
    panNumber: 'FGHIJ6789K',
    cinNumber: 'U28910MH2018PLC234567',
    tags: ['6'],
    status: 'Interested',
    createdDate: new Date('2024-02-15').toISOString(),
    createdBy: 'emp001',
    updatedDate: new Date('2024-02-25').toISOString(),
    isDeleted: false,
  },
];

// Mock MD Requests Data
// IS_RESOLVED=false → pending (employee sent to MD, awaiting decision)
// IS_RESOLVED=true  → resolved (MD has acted)
export let MOCK_MD_REQUESTS: VendorMdRequest[] = [
  {
    id: 'mdr-1',
    vendorId: '3',
    empId: 'emp002',
    empRemark: 'Customer visited HQ and showed strong interest. Requesting status change to Interested.',
    isResolved: false,
    createdDate: new Date('2024-03-25').toISOString(),
  },
  {
    id: 'mdr-2',
    vendorId: '5',
    empId: 'emp001',
    empRemark: 'All documents verified. Long-term relationship established. Propose to mark as Final.',
    mdId: 'md001',
    mdRemark: 'Reviewed and agreed. Status updated to Final by MD.',
    isResolved: true,
    createdDate: new Date('2024-02-20').toISOString(),
    resolvedDate: new Date('2024-02-25').toISOString(),
  },
  {
    id: 'mdr-3',
    vendorId: '4',
    empId: 'emp002',
    empRemark: 'Initial meetings conducted. Company has shown genuine interest in collaboration.',
    isResolved: false,
    createdDate: new Date('2024-04-01').toISOString(),
  },
];

// Mock Documents Data
export const MOCK_DOCUMENTS: VendorDocument[] = [
  {
    id: '1',
    vendorId: '1',
    documentType: 'GST Certificate',
    fileName: 'TechCorp_GST_Certificate.pdf',
    status: 'Verified',
    remarks: 'Valid until Dec 2026',
    uploadedDate: new Date('2024-01-16').toISOString(),
    uploadedBy: 'emp001',
    verifiedDate: new Date('2024-01-17').toISOString(),
    verifiedBy: 'md001',
  },
  {
    id: '2',
    vendorId: '1',
    documentType: 'PAN Card',
    fileName: 'TechCorp_PAN.pdf',
    status: 'Verified',
    uploadedDate: new Date('2024-01-16').toISOString(),
    uploadedBy: 'emp001',
    verifiedDate: new Date('2024-01-17').toISOString(),
    verifiedBy: 'md001',
  },
  {
    id: '3',
    vendorId: '2',
    documentType: 'GST Certificate',
    fileName: 'MedEquip_GST.pdf',
    status: 'Verified',
    uploadedDate: new Date('2024-02-02').toISOString(),
    uploadedBy: 'emp001',
    verifiedDate: new Date('2024-02-03').toISOString(),
    verifiedBy: 'md001',
  },
  {
    id: '4',
    vendorId: '3',
    documentType: 'GST Certificate',
    fileName: 'GlobalTP_GST.pdf',
    status: 'Pending',
    uploadedDate: new Date('2024-03-11').toISOString(),
    uploadedBy: 'emp002',
  },
  {
    id: '5',
    vendorId: '3',
    documentType: 'PAN Card',
    fileName: 'GlobalTP_PAN.pdf',
    status: 'Pending',
    uploadedDate: new Date('2024-03-11').toISOString(),
    uploadedBy: 'emp002',
  },
];

// ─── Vendor CRUD ────────────────────────────────────────────────────────────

export const fetchVendors = async (): Promise<Vendor[]> => {
  return Promise.resolve(MOCK_VENDORS);
};

export const fetchVendorById = async (id: string): Promise<Vendor | null> => {
  const vendor = MOCK_VENDORS.find((v) => v.id === id);
  return Promise.resolve(vendor || null);
};

export const createVendor = async (
  vendor: Omit<Vendor, 'id' | 'createdDate' | 'isDeleted'>
): Promise<Vendor> => {
  const newVendor: Vendor = {
    ...vendor,
    id: `vendor-${Date.now()}`,
    createdDate: new Date().toISOString(),
    isDeleted: false,
  };
  MOCK_VENDORS.push(newVendor);
  return Promise.resolve(newVendor);
};

export const updateVendor = async (
  id: string,
  updates: Partial<Vendor>
): Promise<Vendor> => {
  const index = MOCK_VENDORS.findIndex((v) => v.id === id);
  if (index === -1) throw new Error(`Vendor with id ${id} not found`);
  const updatedVendor: Vendor = {
    ...MOCK_VENDORS[index],
    ...updates,
    updatedDate: new Date().toISOString(),
  };
  MOCK_VENDORS[index] = updatedVendor;
  return Promise.resolve(updatedVendor);
};

export const deleteVendor = async (id: string): Promise<void> => {
  const index = MOCK_VENDORS.findIndex((v) => v.id === id);
  if (index === -1) throw new Error(`Vendor with id ${id} not found`);
  MOCK_VENDORS[index] = { ...MOCK_VENDORS[index], isDeleted: true };
  return Promise.resolve();
};

export const fetchTags = async (): Promise<Tag[]> => {
  return Promise.resolve(MOCK_TAGS);
};

export const fetchVendorDocuments = async (vendorId: string): Promise<VendorDocument[]> => {
  return Promise.resolve(MOCK_DOCUMENTS.filter((doc) => doc.vendorId === vendorId));
};

// ─── MD Request functions ────────────────────────────────────────────────────

/** Return all pending (unresolved) MD requests */
export const fetchPendingMdRequests = async (): Promise<VendorMdRequest[]> => {
  return Promise.resolve(MOCK_MD_REQUESTS.filter((r) => !r.isResolved));
};

/** Return all resolved MD requests */
export const fetchResolvedMdRequests = async (): Promise<VendorMdRequest[]> => {
  return Promise.resolve(MOCK_MD_REQUESTS.filter((r) => r.isResolved));
};

/** Employee sends vendor to MD → creates a pending request */
export const sendVendorToMd = async (
  vendorId: string,
  empId: string,
  empRemark: string
): Promise<VendorMdRequest> => {
  const request: VendorMdRequest = {
    id: `mdr-${Date.now()}`,
    vendorId,
    empId,
    empRemark,
    isResolved: false,
    createdDate: new Date().toISOString(),
  };
  MOCK_MD_REQUESTS.push(request);
  return Promise.resolve(request);
};

/** MD resolves a pending request */
export const resolveMdRequest = async (
  requestId: string,
  mdId: string,
  mdRemark: string
): Promise<VendorMdRequest> => {
  const index = MOCK_MD_REQUESTS.findIndex((r) => r.id === requestId);
  if (index === -1) throw new Error(`MD request ${requestId} not found`);
  const resolved: VendorMdRequest = {
    ...MOCK_MD_REQUESTS[index],
    mdId,
    mdRemark,
    isResolved: true,
    resolvedDate: new Date().toISOString(),
  };
  MOCK_MD_REQUESTS[index] = resolved;
  return Promise.resolve(resolved);
};

/** Check if a vendor has an active (unresolved) pending request */
export const getActivePendingRequest = async (vendorId: string): Promise<VendorMdRequest | null> => {
  const req = MOCK_MD_REQUESTS.find((r) => r.vendorId === vendorId && !r.isResolved);
  return Promise.resolve(req || null);
};