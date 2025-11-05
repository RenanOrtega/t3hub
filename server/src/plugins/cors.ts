import type { FastifyPluginAsync } from 'fastify';
import fastifyCors from '@fastify/cors';

export const corsPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(fastifyCors, {
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    credentials: true,
  });
};
