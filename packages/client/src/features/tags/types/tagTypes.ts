// Types matching exact backend schema

export interface Tag {
  id: string;
  name: string;
  createdBy: string;
  updatedBy?: string;
  createdDate: string;
  updatedDate: string;
}

export interface VendorTag {
  id: string;
  vendorId: string;
  tagId: string;
  enableMail: boolean;
  createdBy: string;
  createdDate: string;
  vendor: Vendor;
  tag: Tag;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  tags?: VendorTag[];
}

export interface TagWithVendorCount extends Tag {
  vendorCount: number;
  enabledMailCount: number;
}

// Input types matching backend
export interface CreateTagInput {
  name: string;
}

export interface UpdateTagInput {
  name?: string;
}

export interface SearchTagInput {
  search?: string;
  limit?: number;
  offset?: number;
}

// Frontend-specific types
export interface TagTableRow extends TagWithVendorCount {
  key: string;
}

export interface TagVendorDisplay {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  enableMail: boolean;
}
