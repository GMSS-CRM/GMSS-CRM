/**
 * Type definitions for Vendors module
 */

export type UserRole = 'EMPLOYEE' | 'MD';

export type CompanyStatus = 'New' | 'Interested' | 'Final';

export type CompanyType =
  | 'Vendor'
  | 'Consultant';

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
  companyType: CompanyType;
  isLinkedWithRailways: boolean;
  address?: string;
  contactPersons: ContactPerson[];
  // Business Identity Fields
  gstNumber?: string;
  panNumber?: string;
  msmeNumber?: string;
  cinNumber?: string;
  tagIds: string[];
  tagNames: string[];
  status: CompanyStatus;
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
  fileName?: string;
  status: DocumentStatus;
  remarks?: string;
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

/**
 * MD Request — tracks employee→MD workflow for vendor status changes.
 * IS_RESOLVED=false  → pending (employee sent to MD, awaiting decision)
 * IS_RESOLVED=true   → resolved (MD acted on it)
 */
export interface VendorMdRequest {
  id: string;
  vendorId: string;
  empId: string;
  empRemark?: string;
  mdId?: string;
  mdRemark?: string;
  isResolved: boolean;
  createdDate: string;
  resolvedDate?: string;
}
