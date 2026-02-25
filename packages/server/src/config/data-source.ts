import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

import { 
  User, 
  Role, 
  RolePermission, 
  Tag, 
  Vendor, 
  VendorTag, 
  VendorContactPerson, 
  VendorDocument, 
  Tender, 
  TenderDocument, 
  TenderTag,
  VendorAgreement,
  VendorApproval,
  VendorFollowUp,
  VendorProposal,
  VendorTender,
  VendorWorkflow,
  VendorMdRequest
} from "../entities";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",

  url: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },

  entities: [
    User, 
    Role, 
    RolePermission, 
    Tag, 
    Vendor, 
    VendorTag, 
    VendorContactPerson, 
    VendorDocument, 
    Tender, 
    TenderDocument, 
    TenderTag,
    VendorAgreement,
    VendorApproval,
    VendorFollowUp,
    VendorProposal,
    VendorTender,
    VendorWorkflow,
    VendorMdRequest
  ],

  synchronize: true, // ❗ OK for now, disable later
  logging: false,
});
