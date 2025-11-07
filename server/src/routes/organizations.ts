import type { FastifyPluginAsync } from "fastify";
import { db } from "../db/index";
import { organizations } from "../db/schema";
import {
  createOrganizationSchema,
  updateOrganizationSchema,
  getOrganizationsQuerySchema,
  type CreateOrganizationInput,
  type UpdateOrganizationInput,
  type GetOrganizationsQuery,
} from "../schemas/organizations";
import { eq, ilike } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";

export const organizationsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/organizations/my",
    { preHandler: requireAuth },
    async (request, reply) => {
      const result = await db
        .select()
        .from(organizations)
        .where(eq(organizations.managerUserId, request.user.userId));

      return reply.send(result);
    }
  );

  fastify.get<{ Querystring: GetOrganizationsQuery }>(
    "/organizations",
    async (request, reply) => {
      const query = getOrganizationsQuerySchema.parse(request.query);

      let result = await db.select().from(organizations);

      if (query.search) {
        result = await db
          .select()
          .from(organizations)
          .where(ilike(organizations.name, `%${query.search}%`));
      }

      return reply.send(result);
    }
  );

  fastify.get<{ Params: { id: string } }>(
    "/organizations/:id",
    async (request, reply) => {
      const { id } = request.params;

      const [organization] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, id));

      if (!organization) {
        return reply.status(404).send({ error: "Organization not found" });
      }

      return reply.send(organization);
    }
  );

  fastify.post<{ Body: CreateOrganizationInput }>(
    "/organizations",
    { preHandler: requireAuth },
    async (request, reply) => {
      const data = createOrganizationSchema.parse(request.body);

      const [organization] = await db
        .insert(organizations)
        .values({
          ...data,
          managerUserId: request.user.userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return reply.status(201).send(organization);
    }
  );

  fastify.patch<{ Params: { id: string }; Body: UpdateOrganizationInput }>(
    "/organizations/:id",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id } = request.params;
      const data = updateOrganizationSchema.parse(request.body);

      const [existingOrg] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, id));

      if (!existingOrg) {
        return reply.status(404).send({ error: "Organization not found" });
      }

      if (existingOrg.managerUserId !== request.user.userId) {
        return reply.status(403).send({
          error: "Forbidden: Only the organization manager can update it",
        });
      }

      const [organization] = await db
        .update(organizations)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(organizations.id, id))
        .returning();

      return reply.send(organization);
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    "/organizations/:id",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id } = request.params;

      const [existingOrg] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, id));

      if (!existingOrg) {
        return reply.status(404).send({ error: "Organization not found" });
      }

      if (existingOrg.managerUserId !== request.user.userId) {
        return reply.status(403).send({
          error: "Forbidden: Only the organization manager can delete it",
        });
      }

      await db.delete(organizations).where(eq(organizations.id, id));

      return reply.status(204).send();
    }
  );
};
