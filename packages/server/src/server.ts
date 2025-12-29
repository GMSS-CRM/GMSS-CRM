import "reflect-metadata";
import express from "express";
import http from "http";
import dotenv from "dotenv";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";


import { typeDefs, resolvers } from "./graphql";
import type { GraphQLContext } from "./types";
import { AppDataSource } from "./config/data-source";

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;

export async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(express.json());

  // DB init
  await AppDataSource.initialize();
  console.log("✅ Database connected");

  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => ({
        req,
        token: req.headers.authorization ?? null,
      }),
    })
  );

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}
