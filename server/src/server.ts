import Fastify from 'fastify';
import { corsPlugin } from './plugins/cors';
import { playersRoutes } from './routes/players';
import { scrimSlotsRoutes } from './routes/scrim-slots';
import { scrimRequestsRoutes } from './routes/scrim-requests';
import { ZodError } from 'zod';

const PORT = parseInt(process.env.PORT ?? '3000', 10);
const HOST = process.env.HOST ?? '0.0.0.0';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
  },
});

await fastify.register(corsPlugin);

fastify.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: 'Validation error',
      details: error.errors,
    });
  }

  fastify.log.error(error);

  return reply.status(500).send({
    error: 'Internal server error',
    message: error.message,
  });
});

await fastify.register(playersRoutes, { prefix: '/api' });
await fastify.register(scrimSlotsRoutes, { prefix: '/api' });
await fastify.register(scrimRequestsRoutes, { prefix: '/api' });

fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: HOST });
    fastify.log.info(`Server listening on http://${HOST}:${PORT}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
