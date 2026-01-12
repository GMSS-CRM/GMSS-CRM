import 'reflect-metadata';
import { startApolloServer } from "./server";

startApolloServer().catch((err) => {
  console.error("❌ Server failed to start", err);
});
