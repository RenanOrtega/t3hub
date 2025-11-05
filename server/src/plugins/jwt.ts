import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import type { FastifyPluginAsync } from "fastify";

export const jwtPlugin: FastifyPluginAsync = fp(async (fastify) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is required");
  }

  await fastify.register(jwt, {
    secret: jwtSecret,
    sign: {
      expiresIn: "7d",
    },
  });

  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: "Unauthorized" });
    }
  });
});
