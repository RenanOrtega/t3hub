import type { FastifyPluginAsync } from 'fastify';
import { db } from '../db/index';
import { scrimSlots } from '../db/schema';
import {
  createScrimSlotSchema,
  updateScrimSlotSchema,
  getScrimSlotsQuerySchema,
  type CreateScrimSlotInput,
  type UpdateScrimSlotInput,
  type GetScrimSlotsQuery,
} from '../schemas/scrim-slots';
import { eq, and, gte } from 'drizzle-orm';

export const scrimSlotsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Querystring: GetScrimSlotsQuery }>('/scrims', async (request, reply) => {
    const query = getScrimSlotsQuerySchema.parse(request.query);

    const conditions = [];

    if (query.status) {
      conditions.push(eq(scrimSlots.status, query.status));
    }

    if (query.fromDate) {
      conditions.push(gte(scrimSlots.dateTimeStart, query.fromDate));
    }

    const result = conditions.length > 0
      ? await db.select().from(scrimSlots).where(and(...conditions))
      : await db.select().from(scrimSlots);

    return reply.send(result);
  });

  fastify.get<{ Params: { id: string } }>('/scrims/:id', async (request, reply) => {
    const { id } = request.params;

    const [slot] = await db.select().from(scrimSlots).where(eq(scrimSlots.id, id));

    if (!slot) {
      return reply.status(404).send({ error: 'Scrim slot not found' });
    }

    return reply.send(slot);
  });

  fastify.post<{ Body: CreateScrimSlotInput }>('/scrims', async (request, reply) => {
    const data = createScrimSlotSchema.parse(request.body);

    const [slot] = await db.insert(scrimSlots).values({
      ...data,
      status: 'Open',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return reply.status(201).send(slot);
  });

  fastify.patch<{ Params: { id: string }; Body: UpdateScrimSlotInput }>(
    '/scrims/:id',
    async (request, reply) => {
      const { id } = request.params;
      const data = updateScrimSlotSchema.parse(request.body);

      const [slot] = await db
        .update(scrimSlots)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(scrimSlots.id, id))
        .returning();

      if (!slot) {
        return reply.status(404).send({ error: 'Scrim slot not found' });
      }

      return reply.send(slot);
    }
  );

  fastify.delete<{ Params: { id: string } }>('/scrims/:id', async (request, reply) => {
    const { id } = request.params;

    await db.delete(scrimSlots).where(eq(scrimSlots.id, id));

    return reply.status(204).send();
  });
};
