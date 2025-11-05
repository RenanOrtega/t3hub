import { z } from 'zod';

const LANES = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'] as const;
const AVAILABILITY_STATUSES = ['Active', 'Free Agent', 'Inactive'] as const;

export const createPlayerSchema = z.object({
  userId: z.string().uuid(),
  inGameName: z.string().min(3).max(255),
  primaryLane: z.enum(LANES),
  secondaryLane: z.enum(LANES),
  currentElo: z.number().int().min(0).max(5000),
  peakElo: z.number().int().min(0).max(5000),
  championPool: z.array(z.string()).min(1).max(10),
  availabilityStatus: z.enum(AVAILABILITY_STATUSES),
});

export const updatePlayerSchema = createPlayerSchema.partial();

export const getPlayersQuerySchema = z.object({
  lane: z.enum(LANES).optional(),
  minElo: z.coerce.number().int().min(0).optional(),
  maxElo: z.coerce.number().int().max(5000).optional(),
  availabilityStatus: z.enum(AVAILABILITY_STATUSES).optional(),
});

export type CreatePlayerInput = z.infer<typeof createPlayerSchema>;
export type UpdatePlayerInput = z.infer<typeof updatePlayerSchema>;
export type GetPlayersQuery = z.infer<typeof getPlayersQuerySchema>;
