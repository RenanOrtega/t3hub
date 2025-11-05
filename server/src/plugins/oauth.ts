import fp from "fastify-plugin";
import oauth2 from "@fastify/oauth2";
import cookie from "@fastify/cookie";
import type { FastifyPluginAsync } from "fastify";

const API_URL = process.env.API_URL ?? "http://localhost:3000";

export const oauthPlugin: FastifyPluginAsync = fp(async (fastify) => {
  await fastify.register(cookie, {
    secret: process.env.COOKIE_SECRET,
    parseOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    },
  });

  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const discordClientId = process.env.DISCORD_CLIENT_ID;
  const discordClientSecret = process.env.DISCORD_CLIENT_SECRET;

  if (googleClientId && googleClientSecret) {
    await fastify.register(oauth2, {
      name: "googleOAuth2",
      credentials: {
        client: {
          id: googleClientId,
          secret: googleClientSecret,
        },
        auth: oauth2.GOOGLE_CONFIGURATION,
      },
      startRedirectPath: "/api/auth/google",
      callbackUri: `${API_URL}/api/auth/google/callback`,
      scope: ["profile", "email"],
    });
  }

  if (discordClientId && discordClientSecret) {
    await fastify.register(oauth2, {
      name: "discordOAuth2",
      credentials: {
        client: {
          id: discordClientId,
          secret: discordClientSecret,
        },
        auth: oauth2.DISCORD_CONFIGURATION,
      },
      startRedirectPath: "/api/auth/discord",
      callbackUri: `${API_URL}/api/auth/discord/callback`,
      scope: ["identify", "email"],
    });
  }
});
