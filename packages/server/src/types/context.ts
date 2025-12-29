import type { Request } from "express";

export interface GraphQLContext {
  req: Request;
  token: string | null;
}
