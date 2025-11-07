import type { FastifyPluginAsync } from "fastify";
import { db } from "../db/index";
import { teams, organizations, rosters, players } from "../db/schema";
import {
  createTeamSchema,
  updateTeamSchema,
  getTeamsQuerySchema,
  type CreateTeamInput,
  type UpdateTeamInput,
  type GetTeamsQuery,
} from "../schemas/teams";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";

export const teamsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Querystring: GetTeamsQuery }>(
    "/teams",
    async (request, reply) => {
      const query = getTeamsQuerySchema.parse(request.query);

      let result;

      if (query.organizationId) {
        const conditions = [eq(teams.organizationId, query.organizationId)];

        if (query.rosterStatus) {
          conditions.push(eq(teams.rosterStatus, query.rosterStatus));
        }

        result = await db
          .select()
          .from(teams)
          .where(and(...conditions));
      } else if (query.rosterStatus) {
        result = await db
          .select()
          .from(teams)
          .where(eq(teams.rosterStatus, query.rosterStatus));
      } else {
        result = await db.select().from(teams);
      }

      return reply.send(result);
    }
  );

  fastify.get<{ Params: { id: string } }>(
    "/teams/:id",
    async (request, reply) => {
      const { id } = request.params;

      const [team] = await db.select().from(teams).where(eq(teams.id, id));

      if (!team) {
        return reply.status(404).send({ error: "Team not found" });
      }

      return reply.send(team);
    }
  );

  fastify.get<{ Params: { orgId: string } }>(
    "/organizations/:orgId/teams",
    async (request, reply) => {
      const { orgId } = request.params;

      const result = await db
        .select()
        .from(teams)
        .where(eq(teams.organizationId, orgId));

      return reply.send(result);
    }
  );

  fastify.post<{ Params: { orgId: string }; Body: CreateTeamInput }>(
    "/organizations/:orgId/teams",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { orgId } = request.params;
      const data = createTeamSchema.parse(request.body);

      if (data.organizationId !== orgId) {
        return reply.status(400).send({
          error: "Organization ID in body does not match URL parameter",
        });
      }

      const [organization] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, orgId));

      if (!organization) {
        return reply.status(404).send({ error: "Organization not found" });
      }

      if (organization.managerUserId !== request.user.userId) {
        return reply.status(403).send({
          error: "Forbidden: Only the organization manager can create teams",
        });
      }

      const [team] = await db
        .insert(teams)
        .values({
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return reply.status(201).send(team);
    }
  );

  fastify.patch<{ Params: { id: string }; Body: UpdateTeamInput }>(
    "/teams/:id",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id } = request.params;
      const data = updateTeamSchema.parse(request.body);

      const [existingTeam] = await db
        .select()
        .from(teams)
        .where(eq(teams.id, id));

      if (!existingTeam) {
        return reply.status(404).send({ error: "Team not found" });
      }

      const [organization] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, existingTeam.organizationId));

      if (!organization) {
        return reply.status(404).send({ error: "Organization not found" });
      }

      if (organization.managerUserId !== request.user.userId) {
        return reply.status(403).send({
          error: "Forbidden: Only the organization manager can update teams",
        });
      }

      const [team] = await db
        .update(teams)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(teams.id, id))
        .returning();

      return reply.send(team);
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    "/teams/:id",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id } = request.params;

      const [existingTeam] = await db
        .select()
        .from(teams)
        .where(eq(teams.id, id));

      if (!existingTeam) {
        return reply.status(404).send({ error: "Team not found" });
      }

      const [organization] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, existingTeam.organizationId));

      if (!organization) {
        return reply.status(404).send({ error: "Organization not found" });
      }

      if (organization.managerUserId !== request.user.userId) {
        return reply.status(403).send({
          error: "Forbidden: Only the organization manager can delete teams",
        });
      }

      await db.delete(teams).where(eq(teams.id, id));

      return reply.status(204).send();
    }
  );

  fastify.get<{ Params: { id: string } }>(
    "/teams/:id/roster",
    async (request, reply) => {
      const { id } = request.params;

      const [team] = await db.select().from(teams).where(eq(teams.id, id));

      if (!team) {
        return reply.status(404).send({ error: "Team not found" });
      }

      const result = await db
        .select({
          player: players,
          joinDate: rosters.joinDate,
        })
        .from(rosters)
        .innerJoin(players, eq(rosters.playerId, players.id))
        .where(eq(rosters.teamId, id));

      return reply.send(result);
    }
  );
};
