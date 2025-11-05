import type { FastifyPluginAsync } from 'fastify';
import { db } from '../db/index';
import { players } from '../db/schema';
import {
  createPlayerSchema,
  updatePlayerSchema,
  getPlayersQuerySchema,
  type CreatePlayerInput,
  type UpdatePlayerInput,
  type GetPlayersQuery,
} from '../schemas/players';
import { eq, and, gte, lte, or } from 'drizzle-orm';

export const playersRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Querystring: GetPlayersQuery }>('/players', async (request, reply) => {
    const query = getPlayersQuerySchema.parse(request.query);

    const conditions = [];

    if (query.lane) {
      conditions.push(
        or(
          eq(players.primaryLane, query.lane),
          eq(players.secondaryLane, query.lane)
        )
      );
    }

    if (query.minElo !== undefined) {
      conditions.push(gte(players.currentElo, query.minElo));
    }

    if (query.maxElo !== undefined) {
      conditions.push(lte(players.currentElo, query.maxElo));
    }

    if (query.availabilityStatus) {
      conditions.push(eq(players.availabilityStatus, query.availabilityStatus));
    }

    const result = conditions.length > 0
      ? await db.select().from(players).where(and(...conditions))
      : await db.select().from(players);

    return reply.send(result);
  });

  fastify.get<{ Params: { id: string } }>('/players/:id', async (request, reply) => {
    const { id } = request.params;

    const [player] = await db.select().from(players).where(eq(players.id, id));

    if (!player) {
      return reply.status(404).send({ error: 'Player not found' });
    }

    return reply.send(player);
  });

  fastify.post<{ Body: CreatePlayerInput }>('/players', async (request, reply) => {
    const data = createPlayerSchema.parse(request.body);

    const [player] = await db.insert(players).values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return reply.status(201).send(player);
  });

  fastify.patch<{ Params: { id: string }; Body: UpdatePlayerInput }>(
    '/players/:id',
    async (request, reply) => {
      const { id } = request.params;
      const data = updatePlayerSchema.parse(request.body);

      const [player] = await db
        .update(players)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(players.id, id))
        .returning();

      if (!player) {
        return reply.status(404).send({ error: 'Player not found' });
      }

      return reply.send(player);
    }
  );

  fastify.delete<{ Params: { id: string } }>('/players/:id', async (request, reply) => {
    const { id } = request.params;

    await db.delete(players).where(eq(players.id, id));

    return reply.status(204).send();
  });
};
