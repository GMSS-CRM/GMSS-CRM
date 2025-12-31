import { AppDataSource } from "../../config/data-source";
import { AppSetting } from "../../entities/AppSetting";

export const appSettingRepository = AppDataSource.getRepository(AppSetting);
