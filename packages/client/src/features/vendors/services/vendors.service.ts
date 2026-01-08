import type { Vendor, VendorDocument, Tag, ApprovalHistory } from '../types';

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
    vendorType: 'OEM',
    address: '123 MG Road, Bangalore, Karnataka 560001',
    contactPersonName: 'Rahul Mehta',
    contactEmail: 'rahul.mehta@techcorp.in',
    contactPhone: '+91 9876543210',
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
    vendorType: 'Distributor',
    address: 'Plot 45, Industrial Area, Phase 2, Noida, UP 201301',
    contactPersonName: 'Dr. Priya Sharma',
    contactEmail: 'priya@medequip.co.in',
    contactPhone: '+91 9123456789',
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
    vendorType: 'Trader',
    address: '56 Nehru Place, New Delhi, Delhi 110019',
    contactPersonName: 'Amit Kumar',
    contactEmail: 'amit@globaltp.com',
    contactPhone: '+91 9988776655',
    gstNumber: '07PQRST9012H3Z4',
    panNumber: 'PQRST9012H',
    tags: ['1', '3', '6'],
    status: 'Submitted',
    createdDate: new Date('2024-03-10').toISOString(),
    createdBy: 'vendor-user',
    isDeleted: false,
  },
  {
    id: '4',
    vendorCode: 'VND-0004',
    companyName: 'Pharma Distributors Inc',
    vendorType: 'Distributor',
    address: 'Tower B, Cyber City, Gurgaon, Haryana 122002',
    contactPersonName: 'Anjali Verma',
    contactEmail: 'anjali@pharmadist.in',
    contactPhone: '+91 9876012345',
    gstNumber: '06LMNOP3456I4Z9',
    panNumber: 'LMNOP3456I',
    tags: ['5'],
    status: 'Draft',
    createdDate: new Date('2024-03-20').toISOString(),
    createdBy: 'vendor-user',
    isDeleted: false,
  },
  {
    id: '5',
    vendorCode: 'VND-0005',
    companyName: 'Industrial Systems OEM',
    vendorType: 'OEM',
    address: 'MIDC Area, Pune, Maharashtra 411019',
    contactPersonName: 'Vikram Patel',
    contactEmail: 'vikram@industrialoem.com',
    contactPhone: '+91 9123987654',
    gstNumber: '27FGHIJ6789K5Z2',
    panNumber: 'FGHIJ6789K',
    cinNumber: 'U28910MH2018PLC234567',
    tags: ['6'],
    status: 'Rejected',
    createdDate: new Date('2024-02-15').toISOString(),
    createdBy: 'vendor-user',
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
    uploadedBy: 'vendor-user',
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
    uploadedBy: 'vendor-user',
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
    uploadedBy: 'vendor-user',
  },
  {
    id: '8',
    vendorId: '3',
    documentType: 'PAN Card',
    fileName: 'GlobalTP_PAN.pdf',
    status: 'Pending',
    uploadedDate: new Date('2024-03-11').toISOString(),
    uploadedBy: 'vendor-user',
  },
  {
    id: '9',
    vendorId: '5',
    documentType: 'GST Certificate',
    fileName: 'Industrial_GST.pdf',
    status: 'Rejected',
    remarks: 'Certificate expired. Please upload valid certificate.',
    uploadedDate: new Date('2024-02-16').toISOString(),
    uploadedBy: 'vendor-user',
    verifiedDate: new Date('2024-02-20').toISOString(),
    verifiedBy: 'approver@gmss.com',
  },
];

// Mock Approval History Data - Enhanced with comprehensive workflows
export const MOCK_APPROVAL_HISTORY: ApprovalHistory[] = [
  // Vendor 1 - Approved workflow
  {
    id: '1',
    vendorId: '1',
    action: 'Created',
    status: 'Draft',
    performedBy: 'admin',
    performedDate: new Date('2024-01-15T10:30:00').toISOString(),
    comments: 'Initial vendor creation',
  },
  {
    id: '2',
    vendorId: '1',
    action: 'Submitted for Approval',
    status: 'Submitted',
    performedBy: 'admin',
    performedDate: new Date('2024-01-16T14:20:00').toISOString(),
    comments: 'All required documents uploaded',
  },
  {
    id: '3',
    vendorId: '1',
    action: 'Approved',
    status: 'Approved',
    performedBy: 'approver@gmss.com',
    performedDate: new Date('2024-01-18T09:15:00').toISOString(),
    comments: 'All documents verified and approved. Vendor credentials verified.',
  },
  // Vendor 3 - Submitted (under review)
  {
    id: '4',
    vendorId: '3',
    action: 'Created',
    status: 'Draft',
    performedBy: 'vendor-user',
    performedDate: new Date('2024-03-10T11:00:00').toISOString(),
  },
  {
    id: '5',
    vendorId: '3',
    action: 'Submitted for Approval',
    status: 'Submitted',
    performedBy: 'vendor-user',
    performedDate: new Date('2024-03-11T16:45:00').toISOString(),
    comments: 'Ready for review',
  },
  // Vendor 5 - Rejected workflow
  {
    id: '6',
    vendorId: '5',
    action: 'Created',
    status: 'Draft',
    performedBy: 'vendor-user',
    performedDate: new Date('2024-02-15T13:30:00').toISOString(),
  },
  {
    id: '7',
    vendorId: '5',
    action: 'Submitted for Approval',
    status: 'Submitted',
    performedBy: 'vendor-user',
    performedDate: new Date('2024-02-16T10:00:00').toISOString(),
  },
  {
    id: '8',
    vendorId: '5',
    action: 'Rejected',
    status: 'Rejected',
    performedBy: 'approver@gmss.com',
    performedDate: new Date('2024-02-20T15:30:00').toISOString(),
    comments: 'GST Certificate has expired. Please upload a valid certificate and resubmit.',
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
 * Delete a vendor (soft delete)
 * @param id - Vendor ID
 * @returns Promise<void>
 */
export const deleteVendor = async (_id: string): Promise<void> => {
  // TODO: Replace with actual API call
  return Promise.resolve();
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

/**
 * Fetch approval history for a vendor
 * @param vendorId - Vendor ID
 * @returns Promise<ApprovalHistory[]>
 */
export const fetchApprovalHistory = async (
  vendorId: string
): Promise<ApprovalHistory[]> => {
  // TODO: Replace with actual API call
  const history = MOCK_APPROVAL_HISTORY.filter((h) => h.vendorId === vendorId);
  return Promise.resolve(history);
};
