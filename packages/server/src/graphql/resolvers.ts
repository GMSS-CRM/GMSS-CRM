import { userResolvers } from "../components/user/resolver";
import { roleResolvers } from "../components/role/resolver";
import { rolePermissionResolvers } from "../components/role-permission/resolver";   

export const resolvers = [ userResolvers, roleResolvers, rolePermissionResolvers ];
