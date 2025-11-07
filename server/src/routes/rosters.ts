import type { FastifyPluginAsync } from "fastify";
import { db } from "../db/index";
import { rosters, teams, players, organizations } from "../db/schema";
import {
  addPlayerToRosterSchema,
  type AddPlayerToRosterInput,
} from "../schemas/rosters";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";
import { rankToNumericValue, numericValueToRank } from "../../../shared/types/rank";

export const rostersRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Params: { teamId: string }; Body: AddPlayerToRosterInput }>(
    "/teams/:teamId/roster",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { teamId } = request.params;
      const data = addPlayerToRosterSchema.parse(request.body);

      const [team] = await db.select().from(teams).where(eq(teams.id, teamId));

      if (!team) {
        return reply.status(404).send({ error: "Team not found" });
      }

      const [organization] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, team.organizationId));

      if (!organization) {
        return reply.status(404).send({ error: "Organization not found" });
      }

      if (organization.managerUserId !== request.user.userId) {
        return reply.status(403).send({
          error: "Forbidden: Only the organization manager can modify roster",
        });
      }

      const [player] = await db
        .select()
        .from(players)
        .where(eq(players.id, data.playerId));

      if (!player) {
        return reply.status(404).send({ error: "Player not found" });
      }

      const [existingRoster] = await db
        .select()
        .from(rosters)
        .where(eq(rosters.playerId, data.playerId));

      if (existingRoster) {
        return reply.status(400).send({
          error: "Player is already in a team roster",
        });
      }

      const [roster] = await db
        .insert(rosters)
        .values({
          playerId: data.playerId,
          teamId,
          joinDate: new Date(),
          createdAt: new Date(),
        })
        .returning();

      const teamRoster = await db
        .select({
          player: players,
        })
        .from(rosters)
        .innerJoin(players, eq(rosters.playerId, players.id))
        .where(eq(rosters.teamId, teamId));

      if (teamRoster.length > 0) {
        const totalRankValue = teamRoster.reduce((sum, item) => {
          return sum + rankToNumericValue(item.player.currentElo);
        }, 0);

        const averageRankValue = totalRankValue / teamRoster.length;
        const averageRank = numericValueToRank(Math.round(averageRankValue));

        await db
          .update(teams)
          .set({
            averageRank,
            updatedAt: new Date(),
          })
          .where(eq(teams.id, teamId));
      }

      return reply.status(201).send(roster);
    }
  );

  fastify.delete<{ Params: { teamId: string; playerId: string } }>(
    "/teams/:teamId/roster/:playerId",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { teamId, playerId } = request.params;

      const [team] = await db.select().from(teams).where(eq(teams.id, teamId));

      if (!team) {
        return reply.status(404).send({ error: "Team not found" });
      }

      const [organization] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, team.organizationId));

      if (!organization) {
        return reply.status(404).send({ error: "Organization not found" });
      }

      if (organization.managerUserId !== request.user.userId) {
        return reply.status(403).send({
          error: "Forbidden: Only the organization manager can modify roster",
        });
      }

      const [existingRoster] = await db
        .select()
        .from(rosters)
        .where(and(eq(rosters.teamId, teamId), eq(rosters.playerId, playerId)));

      if (!existingRoster) {
        return reply.status(404).send({
          error: "Player not found in this team roster",
        });
      }

      await db
        .delete(rosters)
        .where(and(eq(rosters.teamId, teamId), eq(rosters.playerId, playerId)));

      const teamRoster = await db
        .select({
          player: players,
        })
        .from(rosters)
        .innerJoin(players, eq(rosters.playerId, players.id))
        .where(eq(rosters.teamId, teamId));

      if (teamRoster.length > 0) {
        const totalRankValue = teamRoster.reduce((sum, item) => {
          return sum + rankToNumericValue(item.player.currentElo);
        }, 0);

        const averageRankValue = totalRankValue / teamRoster.length;
        const averageRank = numericValueToRank(Math.round(averageRankValue));

        await db
          .update(teams)
          .set({
            averageRank,
            updatedAt: new Date(),
          })
          .where(eq(teams.id, teamId));
      } else {
        await db
          .update(teams)
          .set({
            averageRank: null,
            updatedAt: new Date(),
          })
          .where(eq(teams.id, teamId));
      }

      return reply.status(204).send();
    }
  );
};
