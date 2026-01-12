import { userResolvers } from "../components/user";
import { roleResolvers } from "../components/role";
import { rolePermissionResolvers } from "../components/role-permission";   

export const resolvers = [ userResolvers, roleResolvers, rolePermissionResolvers ];
