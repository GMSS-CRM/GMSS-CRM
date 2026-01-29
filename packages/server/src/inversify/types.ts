export const TYPES = {
  DbContext: Symbol.for('DbContext'),

  IUserRepository: Symbol.for('IUserRepository'),
  IUserService: Symbol.for('IUserService'),

  IRoleRepository: Symbol.for('IRoleRepository'),
  IRoleService: Symbol.for('IRoleService'),

  IRolePermissionRepository: Symbol.for('IRolePermissionRepository'),
  IRolePermissionService: Symbol.for('IRolePermissionService'),

  ITagRepository: Symbol.for('ITagRepository'),
  ITagService: Symbol.for('ITagService'),

  IVendorRepository: Symbol.for('IVendorRepository'),
  IVendorService: Symbol.for('IVendorService'),

  IVendorContactPersonRepository: Symbol.for('IVendorContactPersonRepository'),
  IVendorContactPersonService: Symbol.for('IVendorContactPersonService'),

  IVendorDocumentRepository: Symbol.for('IVendorDocumentRepository'),
  IVendorDocumentService: Symbol.for('IVendorDocumentService'),

  IVendorTagRepository: Symbol.for('IVendorTagRepository'),
  IVendorTagService: Symbol.for('IVendorTagService'),

  ITenderRepository: Symbol.for('ITenderRepository'),
  ITenderService: Symbol.for('ITenderService'),

  ITenderDocumentRepository: Symbol.for('ITenderDocumentRepository'),
  ITenderDocumentService: Symbol.for('ITenderDocumentService'),
};
