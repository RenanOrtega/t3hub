import fp from "fastify-plugin";
import fastifyCors from "@fastify/cors";
import type { FastifyPluginAsync } from "fastify";

export const corsPlugin: FastifyPluginAsync = fp(async (fastify) => {
  await fastify.register(fastifyCors, {
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  });
});
