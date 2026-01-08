export const TYPES = {
  DbContext: Symbol.for('DbContext'),

  IUserRepository: Symbol.for('IUserRepository'),
  IUserService: Symbol.for('IUserService'),

  IRoleRepository: Symbol.for('IRoleRepository'),
  IRoleService: Symbol.for('IRoleService'),

  IRolePermissionRepository: Symbol.for('IRolePermissionRepository'),
  IRolePermissionService: Symbol.for('IRolePermissionService'),
};
