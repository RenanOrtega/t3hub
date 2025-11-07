// server.ts
import "dotenv/config"; // ✅ carrega o .env antes de tudo

import Fastify from "fastify";
import { corsPlugin } from "./plugins/cors";
import { jwtPlugin } from "./plugins/jwt";
import { oauthPlugin } from "./plugins/oauth";
import { playersRoutes } from "./routes/players";
import { organizationsRoutes } from "./routes/organizations";
import { teamsRoutes } from "./routes/teams";
import { rostersRoutes } from "./routes/rosters";
import { scrimSlotsRoutes } from "./routes/scrim-slots";
import { scrimRequestsRoutes } from "./routes/scrim-requests";
import { authRoutes } from "./routes/auth";
import { riotVerificationRoutes } from "./routes/riot-verification";
import { ZodError } from "zod";

const PORT = parseInt(process.env.PORT ?? "3000", 10);
const HOST = process.env.HOST ?? "0.0.0.0";

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? "info",
  },
});

// 🔌 Plugins
await fastify.register(corsPlugin);
await fastify.register(jwtPlugin);
await fastify.register(oauthPlugin);

// ⚠️ Tratamento global de erros
fastify.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: "Validation error",
      details: error.errors,
    });
  }

  fastify.log.error(error);

  return reply.status(500).send({
    error: "Internal server error",
    message: error.message,
  });
});

// 🚀 Rotas
await fastify.register(authRoutes, { prefix: "/api" });
await fastify.register(riotVerificationRoutes, { prefix: "/api" });
await fastify.register(playersRoutes, { prefix: "/api" });
await fastify.register(organizationsRoutes, { prefix: "/api" });
await fastify.register(teamsRoutes, { prefix: "/api" });
await fastify.register(rostersRoutes, { prefix: "/api" });
await fastify.register(scrimSlotsRoutes, { prefix: "/api" });
await fastify.register(scrimRequestsRoutes, { prefix: "/api" });

// 🩺 Health check
fastify.get("/health", async () => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

// 🏁 Inicialização do servidor
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: HOST });
    fastify.log.info(`✅ Server listening on http://${HOST}:${PORT}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
