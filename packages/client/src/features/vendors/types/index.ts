/**
 * Type definitions for Vendors module
 */

export type VendorType = 'Vendor' | 'Consultant';

export type VendorStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected';

export type DocumentStatus = 'Pending' | 'Verified' | 'Rejected';

export interface ContactPerson {
  id: string;
  name: string;
  designation?: string;
  phone?: string;
  email: {
    mailto: string[];
    cc: string[];
    bcc: string[];
  };
}

export interface Vendor {
  id: string;
  vendorCode?: string; // Auto-generated vendor code (e.g., VND-0001)
  companyName: string;
  vendorType: VendorType;
  address?: string;
  contactPersons: ContactPerson[];
  // Business Identity Fields
  gstNumber?: string;
  panNumber?: string;
  msmeNumber?: string;
  cinNumber?: string;
  tags: string[];
  status: VendorStatus;
  createdDate: string;
  createdBy?: string;
  updatedDate?: string;
  updatedBy?: string;
  isDeleted: boolean;
}

export type DocumentType = 
  | 'GST Certificate'
  | 'PAN Card'
  | 'MSME / UDYAM Certificate'
  | 'Experience Certificate';

export interface VendorDocument {
  id: string;
  vendorId: string;
  documentType: string;
  fileName?: string; // Optional file name for mock purposes
  status: DocumentStatus;
  remarks?: string; // Optional remarks/comments
  uploadedDate?: string;
  uploadedBy?: string;
  verifiedDate?: string;
  verifiedBy?: string;
  expired?: boolean;
  expiryDate?: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}
