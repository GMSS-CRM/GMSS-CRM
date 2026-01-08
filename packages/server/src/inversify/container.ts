import { Container } from 'inversify';
import { TYPES } from './types';

import { UserRepository } from '../components/user';
import { UserService } from '../components/user/';
import {IUserRepository} from '../components/user/types';
import {IUserService} from '../components/user/types';
import { AppDataSource } from '../config/data-source';

import { RolePermissionRepository } from '../components/role-permission/repository';
import { RolePermissionService } from '../components/role-permission/service';
import {
  IRolePermissionRepository,
  IRolePermissionService,
} from '../components/role-permission/types';
import { IRoleRepository,IRoleService } from '../components/role/types';
import { RoleRepository } from '../components/role/repository';
import { RoleService } from '../components/role/service';

const container = new Container({ defaultScope: 'Singleton' });

container.bind(TYPES.DbContext).toConstantValue(AppDataSource);

container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<IUserService>(TYPES.IUserService).to(UserService);
container
  .bind<IRolePermissionRepository>(TYPES.IRolePermissionRepository)
  .to(RolePermissionRepository);

container
  .bind<IRolePermissionService>(TYPES.IRolePermissionService)
  .to(RolePermissionService);
  container
  .bind<IRoleRepository>(TYPES.IRoleRepository)
  .to(RoleRepository);

container
  .bind<IRoleService>(TYPES.IRoleService)
  .to(RoleService);
export { container };
