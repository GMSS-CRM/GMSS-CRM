import "reflect-metadata";
import express from "express";
import http from "http";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { mergedTypeDefs, resolvers } from "./graphql";
import buildContext from './context';
import { AppDataSource } from "./config/data-source";

dotenv.config();

interface GraphQLContext {
  req: express.Request;
  token: string | null;
  user?: any;
  pubsub?: any;
  appName?: any;
}

const PORT = Number(process.env.PORT) || 4000;

export async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(express.json());

  // DB init
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connected!");
  } catch (err) {
    console.warn('⚠️ Database initialization failed, starting server in degraded mode:', (err as any)?.message ?? err);
  }

  const server = new ApolloServer<GraphQLContext>({
    typeDefs: mergedTypeDefs,
    resolvers,
    introspection: true,
  });

  await server.start();
  app.get("/", (_req, res) => {
    res.send("OK");
  });

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        const ctx = await buildContext({ req });
        return { ...ctx, req, token: req.headers.authorization ?? null } as GraphQLContext;
      },
    })
  );

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}
