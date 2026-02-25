import "reflect-metadata";
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { mergedTypeDefs, resolvers } from "./graphql";
import buildContext from './context';
import { AppDataSource } from "./config/data-source";
import { requestContextStorage } from './components/common/request-context';

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
  const allowedOrigins = (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin '${origin}' not allowed`));
      }
    },
    credentials: true,
  }));

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
    // Wrap each request in AsyncLocalStorage so services can access
    // the current user's context without a global variable
    (req, res, next) => {
      requestContextStorage.run({} as any, () => next());
    },
    expressMiddleware(server, {
      context: async ({ req }) => {
        const ctx = await buildContext({ req });
        // Populate the AsyncLocalStorage store for this request
        const store = requestContextStorage.getStore();
        if (store) {
          Object.assign(store, ctx);
        }
        return { ...ctx, req, token: req.headers.authorization ?? null } as GraphQLContext;
      },
    })
  );

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}
