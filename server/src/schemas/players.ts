import { z } from "zod";
import {
  DIVISIONS,
  RANKED_TIERS,
  hasDivisions,
} from "../../../shared/types/rank";

const LANES = ["Top", "Jungle", "Mid", "ADC", "Support"] as const;
const AVAILABILITY_STATUSES = ["Active", "Free Agent", "Inactive"] as const;

export const rankSchema = z
  .object({
    tier: z.enum(RANKED_TIERS),
    division: z.enum(DIVISIONS).nullable(),
    lp: z.number().int().min(0),
  })
  .refine(
    (data) => {
      if (hasDivisions(data.tier)) {
        return data.division !== null && data.lp >= 0 && data.lp <= 100;
      }
      return data.division === null && data.lp >= 0;
    },
    {
      message:
        "Rank inválido: ranks com divisão devem ter divisão (I-IV) e PDL entre 0-100, ranks sem divisão não devem ter divisão e PDL >= 0",
    }
  );

export const createPlayerSchema = z.object({
  userId: z.string().uuid(),
  inGameName: z.string().min(3).max(255),
  primaryLane: z.enum(LANES),
  secondaryLane: z.enum(LANES),
  currentElo: rankSchema,
  peakElo: rankSchema,
  championPool: z.array(z.string()).min(1).max(10),
  availabilityStatus: z.enum(AVAILABILITY_STATUSES),
});

export const updatePlayerSchema = createPlayerSchema.partial();

export const getPlayersQuerySchema = z.object({
  lane: z.enum(LANES).optional(),
  minRank: rankSchema.optional(),
  maxRank: rankSchema.optional(),
  availabilityStatus: z.enum(AVAILABILITY_STATUSES).optional(),
});

export type CreatePlayerInput = z.infer<typeof createPlayerSchema>;
export type UpdatePlayerInput = z.infer<typeof updatePlayerSchema>;
export type GetPlayersQuery = z.infer<typeof getPlayersQuerySchema>;
