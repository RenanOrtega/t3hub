import type { FastifyPluginAsync } from "fastify";
import { db } from "../db/index";
import { players } from "../db/schema";
import {
  createPlayerSchema,
  updatePlayerSchema,
  getPlayersQuerySchema,
  type CreatePlayerInput,
  type UpdatePlayerInput,
  type GetPlayersQuery,
} from "../schemas/players";
import { eq, and, or } from "drizzle-orm";
import { compareRanks } from "../../../shared/types/rank";

export const playersRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Querystring: GetPlayersQuery }>(
    "/players",
    async (request, reply) => {
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

      if (query.availabilityStatus) {
        conditions.push(
          eq(players.availabilityStatus, query.availabilityStatus)
        );
      }

      let result =
        conditions.length > 0
          ? await db
              .select()
              .from(players)
              .where(and(...conditions))
          : await db.select().from(players);

      if (query.minRank) {
        result = result.filter(
          (player) => compareRanks(player.currentElo, query.minRank!) >= 0
        );
      }

      if (query.maxRank) {
        result = result.filter(
          (player) => compareRanks(player.currentElo, query.maxRank!) <= 0
        );
      }

      return reply.send(result);
    }
  );

  fastify.get<{ Params: { id: string } }>(
    "/players/:id",
    async (request, reply) => {
      const { id } = request.params;

      const [player] = await db
        .select()
        .from(players)
        .where(eq(players.id, id));

      if (!player) {
        return reply.status(404).send({ error: "Player not found" });
      }

      return reply.send(player);
    }
  );

  fastify.post<{ Body: CreatePlayerInput }>(
    "/players",
    async (request, reply) => {
      const data = createPlayerSchema.parse(request.body);

      const [player] = await db
        .insert(players)
        .values({
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return reply.status(201).send(player);
    }
  );

  fastify.patch<{ Params: { id: string }; Body: UpdatePlayerInput }>(
    "/players/:id",
    async (request, reply) => {
      const { id } = request.params;
      const data = updatePlayerSchema.parse(request.body);

      const [player] = await db
        .update(players)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(players.id, id))
        .returning();

      if (!player) {
        return reply.status(404).send({ error: "Player not found" });
      }

      return reply.send(player);
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    "/players/:id",
    async (request, reply) => {
      const { id } = request.params;

      await db.delete(players).where(eq(players.id, id));

      return reply.status(204).send();
    }
  );
};
