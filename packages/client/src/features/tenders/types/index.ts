export type TenderStatus = 'draft' | 'published' | 'closed';

export type TenderType = 'goods' | 'services' | 'works';

export type VendorType = 'oem' | 'trader' | 'distributor';

export type MandatoryDocument = 'gst' | 'pan' | 'msme';

export interface Tender {
  id: string;
  tenderId: string; // Display ID like TND-0001
  title: string;
  referenceNumber: string;
  issuingDepartment: string;
  tenderType: TenderType;
  description: string;
  estimatedValue?: number;
  
  // Categories & Tags
  categories: string[];
  tags: string[];
  
  // Eligibility
  allowedVendorTypes: VendorType[];
  mandatoryDocuments: MandatoryDocument[];
  minimumExperience?: number; // in years
  
  // Dates
  publishDate?: Date;
  submissionStartDate?: Date;
  submissionEndDate?: Date;
  closingDate?: Date;
  
  // Status
  status: TenderStatus;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

export interface TenderFormData extends Omit<Tender, 'id' | 'tenderId' | 'createdAt' | 'updatedAt'> {
  // Form-specific fields if needed
}
