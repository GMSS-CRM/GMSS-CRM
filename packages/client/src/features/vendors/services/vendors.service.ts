import type { Vendor, VendorDocument, Tag } from '../types';

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

// Mock Vendors Data
export const MOCK_VENDORS: Vendor[] = [
  {
    id: '1',
    vendorCode: 'VND-0001',
    companyName: 'TechCorp India Pvt Ltd',
    vendorType: 'Vendor',
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
    status: 'Approved',
    createdDate: new Date('2024-01-15').toISOString(),
    createdBy: 'admin',
    isDeleted: false,
  },
  {
    id: '2',
    vendorCode: 'VND-0002',
    companyName: 'MedEquip Solutions',
    vendorType: 'Consultant',
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
    status: 'Approved',
    createdDate: new Date('2024-02-01').toISOString(),
    createdBy: 'admin',
    updatedDate: new Date('2024-02-05').toISOString(),
    isDeleted: false,
  },
  {
    id: '3',
    vendorCode: 'VND-0003',
    companyName: 'Global Trade Partners',
    vendorType: 'Consultant',
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
    status: 'Submitted',
    createdDate: new Date('2024-03-10').toISOString(),
    createdBy: 'user',
    isDeleted: false,
  },
  {
    id: '4',
    vendorCode: 'VND-0004',
    companyName: 'Pharma Distributors Inc',
    vendorType: 'Consultant',
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
    status: 'Draft',
    createdDate: new Date('2024-03-20').toISOString(),
    createdBy: 'user',
    isDeleted: false,
  },
  {
    id: '5',
    vendorCode: 'VND-0005',
    companyName: 'Industrial Systems OEM',
    vendorType: 'Vendor',
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
    status: 'Rejected',
    createdDate: new Date('2024-02-15').toISOString(),
    createdBy: 'user',
    updatedDate: new Date('2024-02-25').toISOString(),
    isDeleted: false,
  },
];

// Mock Documents Data - Compliance-oriented structure
export const MOCK_DOCUMENTS: VendorDocument[] = [
  {
    id: '1',
    vendorId: '1',
    documentType: 'GST Certificate',
    fileName: 'TechCorp_GST_Certificate.pdf',
    status: 'Verified',
    remarks: 'Valid until Dec 2026',
    uploadedDate: new Date('2024-01-16').toISOString(),
    uploadedBy: 'admin',
    verifiedDate: new Date('2024-01-17').toISOString(),
    verifiedBy: 'approver@gmss.com',
  },
  {
    id: '2',
    vendorId: '1',
    documentType: 'PAN Card',
    fileName: 'TechCorp_PAN.pdf',
    status: 'Verified',
    uploadedDate: new Date('2024-01-16').toISOString(),
    uploadedBy: 'admin',
    verifiedDate: new Date('2024-01-17').toISOString(),
    verifiedBy: 'approver@gmss.com',
  },
  {
    id: '3',
    vendorId: '1',
    documentType: 'MSME / UDYAM Certificate',
    fileName: 'TechCorp_MSME.pdf',
    status: 'Verified',
    uploadedDate: new Date('2024-01-16').toISOString(),
    uploadedBy: 'admin',
    verifiedDate: new Date('2024-01-17').toISOString(),
    verifiedBy: 'approver@gmss.com',
  },
  {
    id: '4',
    vendorId: '1',
    documentType: 'Experience Certificate',
    fileName: 'TechCorp_Experience.pdf',
    status: 'Verified',
    uploadedDate: new Date('2024-01-16').toISOString(),
    uploadedBy: 'admin',
    verifiedDate: new Date('2024-01-18').toISOString(),
    verifiedBy: 'approver@gmss.com',
  },
  {
    id: '5',
    vendorId: '2',
    documentType: 'GST Certificate',
    fileName: 'MedEquip_GST.pdf',
    status: 'Verified',
    uploadedDate: new Date('2024-02-02').toISOString(),
    uploadedBy: 'user',
    verifiedDate: new Date('2024-02-03').toISOString(),
    verifiedBy: 'approver@gmss.com',
  },
  {
    id: '6',
    vendorId: '2',
    documentType: 'PAN Card',
    fileName: 'MedEquip_PAN.pdf',
    status: 'Verified',
    uploadedDate: new Date('2024-02-02').toISOString(),
    uploadedBy: 'user',
    verifiedDate: new Date('2024-02-03').toISOString(),
    verifiedBy: 'approver@gmss.com',
  },
  {
    id: '7',
    vendorId: '3',
    documentType: 'GST Certificate',
    fileName: 'GlobalTP_GST.pdf',
    status: 'Pending',
    uploadedDate: new Date('2024-03-11').toISOString(),
    uploadedBy: 'user',
  },
  {
    id: '8',
    vendorId: '3',
    documentType: 'PAN Card',
    fileName: 'GlobalTP_PAN.pdf',
    status: 'Pending',
    uploadedDate: new Date('2024-03-11').toISOString(),
    uploadedBy: 'user',
  },
  {
    id: '9',
    vendorId: '5',
    documentType: 'GST Certificate',
    fileName: 'Industrial_GST.pdf',
    status: 'Rejected',
    remarks: 'Certificate expired. Please upload valid certificate.',
    uploadedDate: new Date('2024-02-16').toISOString(),
    uploadedBy: 'user',
    verifiedDate: new Date('2024-02-20').toISOString(),
    verifiedBy: 'approver@gmss.com',
  },
];

/**
 * Fetch all vendors
 * @returns Promise<Vendor[]>
 */
export const fetchVendors = async (): Promise<Vendor[]> => {
  // TODO: Replace with actual API call
  return Promise.resolve(MOCK_VENDORS);
};

/**
 * Fetch vendor by ID
 * @param id - Vendor ID
 * @returns Promise<Vendor | null>
 */
export const fetchVendorById = async (id: string): Promise<Vendor | null> => {
  // TODO: Replace with actual API call
  const vendor = MOCK_VENDORS.find((v) => v.id === id);
  return Promise.resolve(vendor || null);
};

/**
 * Create a new vendor
 * @param vendor - Vendor data to create
 * @returns Promise<Vendor>
 */
export const createVendor = async (
  vendor: Omit<Vendor, 'id' | 'createdDate' | 'isDeleted'>
): Promise<Vendor> => {
  // TODO: Replace with actual API call
  const newVendor: Vendor = {
    ...vendor,
    id: `vendor-${Date.now()}`,
    createdDate: new Date().toISOString(),
    isDeleted: false,
  };

  return Promise.resolve(newVendor);
};

/**
 * Update an existing vendor
 * @param id - Vendor ID
 * @param updates - Partial vendor data to update
 * @returns Promise<Vendor>
 */
export const updateVendor = async (
  id: string,
  updates: Partial<Vendor>
): Promise<Vendor> => {
  // TODO: Replace with actual API call
  const vendor = MOCK_VENDORS.find((v) => v.id === id);
  if (!vendor) {
    throw new Error(`Vendor with id ${id} not found`);
  }

  const updatedVendor: Vendor = {
    ...vendor,
    ...updates,
    updatedDate: new Date().toISOString(),
  };

  return Promise.resolve(updatedVendor);
};


/**
 * Fetch all tags
 * @returns Promise<Tag[]>
 */
export const fetchTags = async (): Promise<Tag[]> => {
  // TODO: Replace with actual API call
  return Promise.resolve(MOCK_TAGS);
};

/**
 * Fetch documents for a vendor
 * @param vendorId - Vendor ID
 * @returns Promise<VendorDocument[]>
 */
export const fetchVendorDocuments = async (
  vendorId: string
): Promise<VendorDocument[]> => {
  // TODO: Replace with actual API call
  const documents = MOCK_DOCUMENTS.filter((doc) => doc.vendorId === vendorId);
  return Promise.resolve(documents);
};
