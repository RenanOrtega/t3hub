import type { FastifyPluginAsync } from "fastify";
import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { users, oauthAccounts } from "../db/schema";

const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

interface DiscordUserInfo {
  id: string;
  email: string;
  username: string;
  avatar: string;
}

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/auth/google/callback", async (request, reply) => {
    try {
      const { token } =
        await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
          request
        );

      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        }
      );

      const userInfo = (await userInfoResponse.json()) as GoogleUserInfo;

      let existingOAuthAccount = await db
        .select()
        .from(oauthAccounts)
        .where(
          and(
            eq(oauthAccounts.provider, "google"),
            eq(oauthAccounts.providerAccountId, userInfo.sub)
          )
        )
        .limit(1)
        .then((rows) => rows[0]);

      let userId: string;

      if (existingOAuthAccount) {
        userId = existingOAuthAccount.userId;

        await db
          .update(users)
          .set({
            displayName: userInfo.name,
            avatarUrl: userInfo.picture,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));
      } else {
        let existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, userInfo.email))
          .limit(1)
          .then((rows) => rows[0]);

        if (!existingUser) {
          const newUser = await db
            .insert(users)
            .values({
              email: userInfo.email,
              role: "Player",
              displayName: userInfo.name,
              avatarUrl: userInfo.picture,
            })
            .returning();

          existingUser = newUser[0];
        }

        userId = existingUser.id;

        await db.insert(oauthAccounts).values({
          userId,
          provider: "google",
          providerAccountId: userInfo.sub,
          accessToken: token.access_token,
          refreshToken: token.refresh_token,
          expiresAt: token.expires_at
            ? new Date(token.expires_at.toString())
            : null,
        });
      }

      const jwtToken = fastify.jwt.sign({
        userId,
        email: userInfo.email,
        role: "Player",
      });

      return reply.redirect(`${FRONTEND_URL}/auth/callback?token=${jwtToken}`);
    } catch (error) {
      fastify.log.error(error);
      return reply.redirect(
        `${FRONTEND_URL}/login?error=authentication_failed`
      );
    }
  });

  fastify.get("/auth/discord/callback", async (request, reply) => {
    try {
      const { token } =
        await fastify.discordOAuth2.getAccessTokenFromAuthorizationCodeFlow(
          request
        );

      const userInfoResponse = await fetch(
        "https://discord.com/api/users/@me",
        {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        }
      );

      const userInfo = (await userInfoResponse.json()) as DiscordUserInfo;

      let existingOAuthAccount = await db
        .select()
        .from(oauthAccounts)
        .where(
          and(
            eq(oauthAccounts.provider, "discord"),
            eq(oauthAccounts.providerAccountId, userInfo.id)
          )
        )
        .limit(1)
        .then((rows) => rows[0]);

      let userId: string;

      if (existingOAuthAccount) {
        userId = existingOAuthAccount.userId;

        const avatarUrl = userInfo.avatar
          ? `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png`
          : null;

        await db
          .update(users)
          .set({
            displayName: userInfo.username,
            avatarUrl,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));
      } else {
        if (!userInfo.email) {
          return reply.redirect(`${FRONTEND_URL}/login?error=email_required`);
        }

        let existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, userInfo.email))
          .limit(1)
          .then((rows) => rows[0]);

        if (!existingUser) {
          const avatarUrl = userInfo.avatar
            ? `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png`
            : null;

          const newUser = await db
            .insert(users)
            .values({
              email: userInfo.email,
              role: "Player",
              displayName: userInfo.username,
              avatarUrl,
            })
            .returning();

          existingUser = newUser[0];
        }

        userId = existingUser.id;

        await db.insert(oauthAccounts).values({
          userId,
          provider: "discord",
          providerAccountId: userInfo.id,
          accessToken: token.access_token,
          refreshToken: token.refresh_token,
          expiresAt: token.expires_at
            ? new Date(token.expires_at.toString())
            : null,
        });
      }

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)
        .then((rows) => rows[0]);

      const jwtToken = fastify.jwt.sign({
        userId,
        email: user.email,
        role: user.role,
      });

      return reply.redirect(`${FRONTEND_URL}/auth/callback?token=${jwtToken}`);
    } catch (error) {
      fastify.log.error(error);
      return reply.redirect(
        `${FRONTEND_URL}/login?error=authentication_failed`
      );
    }
  });

  fastify.get(
    "/auth/me",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)
        .then((rows) => rows[0]);

      if (!user) {
        return reply.status(404).send({ error: "User not found" });
      }

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      };
    }
  );

  fastify.post(
    "/auth/logout",
    { onRequest: [fastify.authenticate] },
    async (_request, reply) => {
      return reply.send({ success: true });
    }
  );
};
