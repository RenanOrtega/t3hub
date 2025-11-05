import '@fastify/jwt';
import type { OAuth2Namespace } from '@fastify/oauth2';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    googleOAuth2: OAuth2Namespace;
    discordOAuth2: OAuth2Namespace;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      userId: string;
      email: string;
      role: string;
    };
    user: {
      userId: string;
      email: string;
      role: string;
    };
  }
}
