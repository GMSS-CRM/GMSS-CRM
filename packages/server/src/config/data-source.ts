import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

import { User, Role, RolePermission } from "../entities";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",

  url: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },

  entities: [User, Role, RolePermission],

  synchronize: true, // ❗ OK for now, disable later
  logging: false,
});
