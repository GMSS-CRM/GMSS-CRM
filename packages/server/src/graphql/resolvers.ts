import { userResolvers } from "../components/user/resolver";
import { roleResolvers } from "../components/role/resolver";
import { appSettingResolvers } from "../components/app-setting/resolver";

export const resolvers = [appSettingResolvers, userResolvers, roleResolvers];
