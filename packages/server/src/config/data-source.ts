import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

import { User, Role, Permission, RolePermission } from "../entities";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",

  // ✅ Neon connection via URL
  url: process.env.DATABASE_URL,

  // ✅ Required for Neon
  ssl: {
    rejectUnauthorized: false,
  },

  entities: [User, Role, Permission, RolePermission],

  synchronize: true, // ❗ OK for now, disable later
  logging: false,
});
