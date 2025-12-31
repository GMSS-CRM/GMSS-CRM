import { appSettingRepository } from "./repository";

export const appSettingService = {
  create: (data: any) => {
    const entity = appSettingRepository.create(data);
    return appSettingRepository.save(entity);
  },

  update: async (id: string, data: any) => {
    await appSettingRepository.update(id, data);
    return appSettingRepository.findOneBy({ id });
  },

  delete: async (id: string) => {
    await appSettingRepository.delete(id);
    return true;
  },

  getById: (id: string) => {
    return appSettingRepository.findOneBy({ id });
  },

  search: (search?: string) => {
    const qb = appSettingRepository.createQueryBuilder("appSetting");

    if (search) {
      qb.where(
        "appSetting.name ILIKE :s OR appSetting.email ILIKE :s",
        { s: `%${search}%` }
      );
    }

    return qb.getMany();
  },
};
