import "reflect-metadata";
import express, { Application } from "express";
import http from "http";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";

//import { typeDefs, resolvers } from "./graphql";  -> Will use later
// import { AppDataSource } from "./config/data-source"; // enable later when DB is ready

dotenv.config();

const PORT = process.env.PORT || 4000;

export async function startApolloServer() {
  const app: Application = express();
  app.use(express.json());

  // 👉 Enable DB later
  // await AppDataSource.initialize();
  // console.log("📦 Database connected");

  const server = new ApolloServer({
   // typeDefs,
    //resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || null;

      return {
        token,
        req,
      };
    },
  });

  await server.start();

  server.applyMiddleware({ app: app as any });

  const httpServer = http.createServer(app);

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );

  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
}
