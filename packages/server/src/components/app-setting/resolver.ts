import { appSettingService } from "./service";

export const appSettingResolvers = {
  Query: {
    getAppSettingById: (_: any, { id }: any) =>
      appSettingService.getById(id),

    getAppSettingsAll: (_: any, { search }: any) =>
      appSettingService.search(search),
  },

  Mutation: {
    createAppSetting: (_: any, { input }: any) =>
      appSettingService.create(input),

    updateAppSetting: (_: any, { id, input }: any) =>
      appSettingService.update(id, input),

    deleteAppSetting: (_: any, { id }: any) =>
      appSettingService.delete(id),
  },
};
