export interface IVendorTagRepository {
  createVendorTag(data: any): Promise<any>;
  findById(id: string): Promise<any>;
  deleteVendorTag(id: string): Promise<any>;
  deleteVendorTagsByVendorId(vendorId: string): Promise<any>;
  findVendorsByTagId(tagId: string): Promise<any>;
  updateEnableMail(id: string, enableMail: boolean): Promise<any>;
}

export interface IVendorTagService {
  createVendorTag(input: any): Promise<any>;
  deleteVendorTag(id: string): Promise<any>;
  getVendorsByTag(tagId: string): Promise<any>;
  updateVendorTagEmail(id: string, enableMail: boolean): Promise<any>;
}
