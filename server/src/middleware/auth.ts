import type { FastifyRequest, FastifyReply } from 'fastify';

export const requireAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();

      const { role } = request.user;

      if (!allowedRoles.includes(role)) {
        return reply.status(403).send({ error: 'Forbidden' });
      }
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  };
};
