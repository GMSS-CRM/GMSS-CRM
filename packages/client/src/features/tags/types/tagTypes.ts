// packages/client/src/features/tags/types/tagTypes.ts

export interface Tag {
  id: string;
  name: string;
  createdBy: string;
  updatedBy?: string;
  createdDate: string;
  updatedDate: string;
}

export interface TagWithVendorCount extends Tag {
  vendorCount: number;
  enabledMailCount: number;
  tenderCount: number;
}

export interface TagVendorDisplay {
  id: string; // vendorTag ID
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  enableMail: boolean;
}

export interface TagTenderDisplay {
  id: string;
  tenderId: string;
  tenderTitle: string;
  tenderNumber: string;
  status: 'active' | 'closed' | 'draft';
  vendorCount: number;
  enabledMailCount: number;
  deadline?: string;
}

export interface TenderVendorDisplay {
  id: string; // tenderVendor ID
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  vendorPhone?: string;
  enableMail: boolean;
  assignedDate: string;
}

export interface CreateTagPayload {
  name: string;
}

export interface UpdateTagPayload {
  name: string;
}