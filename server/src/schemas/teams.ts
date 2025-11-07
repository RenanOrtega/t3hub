import { z } from "zod";
import {
  DIVISIONS,
  RANKED_TIERS,
  hasDivisions,
} from "../../../shared/types/rank";

const ROSTER_STATUSES = ["Full", "Recruiting"] as const;

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

export const createTeamSchema = z.object({
  organizationId: z.string().uuid(),
  teamName: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(255),
  rosterStatus: z.enum(ROSTER_STATUSES),
  averageRank: rankSchema.optional(),
});

export const updateTeamSchema = createTeamSchema.partial().omit({ organizationId: true });

export const getTeamsQuerySchema = z.object({
  organizationId: z.string().uuid().optional(),
  rosterStatus: z.enum(ROSTER_STATUSES).optional(),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type GetTeamsQuery = z.infer<typeof getTeamsQuerySchema>;
