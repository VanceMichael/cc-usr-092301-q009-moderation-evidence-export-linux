import Fastify from "fastify";
import { migrate } from "./database.js";

migrate();
const app = Fastify({ logger: true });
app.get("/health", async () => ({ status: "ok" }));
const host = process.env.HOST ?? "0.0.0.0";
const port = Number(process.env.PORT ?? "8080");
await app.listen({ host, port });
