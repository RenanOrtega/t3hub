import type { FastifyPluginAsync } from 'fastify';
import { db } from '../db/index';
import { scrimRequests } from '../db/schema';
import {
  createScrimRequestSchema,
  updateScrimRequestSchema,
  type CreateScrimRequestInput,
  type UpdateScrimRequestInput,
} from '../schemas/scrim-requests';
import { eq } from 'drizzle-orm';

export const scrimRequestsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/scrim-requests', async (_request, reply) => {
    const result = await db.select().from(scrimRequests);
    return reply.send(result);
  });

  fastify.get<{ Params: { id: string } }>('/scrim-requests/:id', async (request, reply) => {
    const { id } = request.params;

    const [scrimRequest] = await db
      .select()
      .from(scrimRequests)
      .where(eq(scrimRequests.id, id));

    if (!scrimRequest) {
      return reply.status(404).send({ error: 'Scrim request not found' });
    }

    return reply.send(scrimRequest);
  });

  fastify.post<{ Body: CreateScrimRequestInput }>(
    '/scrim-requests',
    async (request, reply) => {
      const data = createScrimRequestSchema.parse(request.body);

      const [scrimRequest] = await db.insert(scrimRequests).values({
        ...data,
        status: 'Pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      return reply.status(201).send(scrimRequest);
    }
  );

  fastify.patch<{ Params: { id: string }; Body: UpdateScrimRequestInput }>(
    '/scrim-requests/:id',
    async (request, reply) => {
      const { id } = request.params;
      const data = updateScrimRequestSchema.parse(request.body);

      const [scrimRequest] = await db
        .update(scrimRequests)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(scrimRequests.id, id))
        .returning();

      if (!scrimRequest) {
        return reply.status(404).send({ error: 'Scrim request not found' });
      }

      return reply.send(scrimRequest);
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    '/scrim-requests/:id',
    async (request, reply) => {
      const { id } = request.params;

      await db.delete(scrimRequests).where(eq(scrimRequests.id, id));

      return reply.status(204).send();
    }
  );
};
