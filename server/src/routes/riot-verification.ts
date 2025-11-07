import type { FastifyPluginAsync } from "fastify";
import { db } from "../db/index";
import { players, type NewPlayer } from "../db/schema";
import { eq } from "drizzle-orm";
import type { Rank } from "@shared/types/rank";
import {
  generateVerificationSchema,
  verifyAccountSchema,
  type GenerateVerificationInput,
  type VerifyAccountInput,
} from "../schemas/riot-verification";
import {
  getAccountByRiotId,
  getSummonerByPuuid,
  getLeagueEntriesByPuuid,
  generateRandomIconId,
  RiotApiError,
} from "../services/riot-api";

const verificationCache = new Map<
  string,
  { iconId: number; expiresAt: number }
>();

export const riotVerificationRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: GenerateVerificationInput }>(
    "/riot/verification/generate",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const { userId } = request.user;
        const data = generateVerificationSchema.parse(request.body);

        const existingPlayer = await db
          .select()
          .from(players)
          .where(eq(players.userId, userId))
          .limit(1)
          .then((rows) => rows[0]);

        if (existingPlayer?.verifiedAt) {
          return reply.status(400).send({
            error: "Conta já verificada",
          });
        }

        try {
          await getAccountByRiotId(data.gameName, data.tagLine);
        } catch (error) {
          if (error instanceof RiotApiError) {
            return reply.status(error.statusCode || 400).send({
              error: error.message,
            });
          }
          throw error;
        }

        const iconId = generateRandomIconId();
        const expiresAt = Date.now() + 10 * 60 * 1000;

        verificationCache.set(userId, { iconId, expiresAt });

        return reply.send({
          verificationIconId: iconId,
          expiresIn: 600,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          error: "Erro ao gerar código de verificação",
        });
      }
    }
  );

  fastify.post<{ Body: VerifyAccountInput }>(
    "/riot/verification/verify",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const { userId } = request.user;

        const data = verifyAccountSchema.parse(request.body);

        const existingPlayer = await db
          .select()
          .from(players)
          .where(eq(players.userId, userId))
          .limit(1)
          .then((rows) => rows[0]);

        if (existingPlayer?.verifiedAt) {
          return reply.status(400).send({
            error: "Conta já verificada",
          });
        }

        const cachedVerification = verificationCache.get(userId);

        if (!cachedVerification) {
          return reply.status(400).send({
            error: "Código de verificação não encontrado ou expirado",
          });
        }

        if (Date.now() > cachedVerification.expiresAt) {
          verificationCache.delete(userId);
          return reply.status(400).send({
            error: "Código de verificação expirado",
          });
        }

        if (cachedVerification.iconId !== data.verificationIconId) {
          return reply.status(400).send({
            error: "Código de verificação inválido",
          });
        }

        try {
          const accountData = await getAccountByRiotId(
            data.gameName,
            data.tagLine
          );

          console.log(accountData);

          const summonerData = await getSummonerByPuuid(accountData.puuid);

          console.log(summonerData);

          if (summonerData.profileIconId !== data.verificationIconId) {
            return reply.status(400).send({
              error:
                "O ícone da conta não corresponde ao código de verificação",
            });
          }

          const leagueEntries = await getLeagueEntriesByPuuid(
            summonerData.puuid
          );

          console.log(leagueEntries);

          const soloQueueEntry = leagueEntries.find(
            (entry: { queueType: string }) =>
              entry.queueType === "RANKED_SOLO_5x5"
          );

          const currentRank = soloQueueEntry
            ? {
                tier: soloQueueEntry.tier as Rank["tier"],
                division:
                  soloQueueEntry.rank === "I"
                    ? ("I" as const)
                    : soloQueueEntry.rank === "II"
                    ? ("II" as const)
                    : soloQueueEntry.rank === "III"
                    ? ("III" as const)
                    : soloQueueEntry.rank === "IV"
                    ? ("IV" as const)
                    : null,
                lp: soloQueueEntry.leaguePoints,
              }
            : null;

          if (existingPlayer) {
            await db
              .update(players)
              .set({
                puuid: accountData.puuid,
                summonerId: summonerData.id,
                gameName: accountData.gameName,
                tagLine: accountData.tagLine,
                profileIconId: summonerData.profileIconId,
                summonerLevel: summonerData.summonerLevel,
                verifiedAt: new Date(),
                primaryLane: data.primaryLane,
                secondaryLane: data.secondaryLane,
                discordTag: data.discordTag,
                currentElo: currentRank as Rank | null,
                peakElo: currentRank as Rank | null,
                availabilityStatus: "Active",
                updatedAt: new Date(),
              })
              .where(eq(players.id, existingPlayer.id));
          } else {
            console.log("Creating new player with data:", {
              userId,
              puuid: accountData.puuid,
              summonerId: summonerData.id,
              gameName: accountData.gameName,
              tagLine: accountData.tagLine,
              region: "BR1",
              profileIconId: summonerData.profileIconId,
              profileIconIdType: typeof summonerData.profileIconId,
              summonerLevel: summonerData.summonerLevel,
              summonerLevelType: typeof summonerData.summonerLevel,
              currentRank,
              currentRankType: typeof currentRank,
            });

            await db.insert(players).values({
              userId,
              puuid: accountData.puuid,
              summonerId: summonerData.id,
              gameName: accountData.gameName,
              tagLine: accountData.tagLine,
              region: "BR1",
              profileIconId: summonerData.profileIconId,
              summonerLevel: summonerData.summonerLevel,
              verifiedAt: new Date(),
              primaryLane: data.primaryLane,
              secondaryLane: data.secondaryLane,
              discordTag: data.discordTag,
              currentElo: currentRank,
              peakElo: currentRank,
              availabilityStatus: "Active",
            });
          }

          verificationCache.delete(userId);

          return reply.send({
            success: true,
            message: "Conta verificada com sucesso",
            player: {
              gameName: accountData.gameName,
              tagLine: accountData.tagLine,
              summonerLevel: summonerData.summonerLevel,
              profileIconId: summonerData.profileIconId,
              currentRank,
            },
          });
        } catch (error) {
          if (error instanceof RiotApiError) {
            return reply.status(error.statusCode || 400).send({
              error: error.message,
            });
          }
          throw error;
        }
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          error: "Erro ao verificar conta",
        });
      }
    }
  );

  fastify.get(
    "/riot/verification/status",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;

      const player = await db
        .select()
        .from(players)
        .where(eq(players.userId, userId))
        .limit(1)
        .then((rows) => rows[0]);

      return reply.send({
        verified: !!player?.verifiedAt,
        player: player
          ? {
              gameName: player.gameName,
              tagLine: player.tagLine,
              summonerLevel: player.summonerLevel,
              verifiedAt: player.verifiedAt,
            }
          : null,
      });
    }
  );
};
