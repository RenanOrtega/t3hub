import { z } from 'zod';
import { rankSchema } from './players';
import { compareRanks } from '../../../shared/types/rank';

const SCRIM_SLOT_STATUSES = ['Open', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as const;

export const createScrimSlotSchema = z.object({
  hostTeamId: z.string().uuid(),
  dateTimeStart: z.coerce.date(),
  durationMinutes: z.number().int().min(30).max(300),
  minRankRequired: rankSchema,
  maxRankRequired: rankSchema,
}).refine((data) => compareRanks(data.minRankRequired, data.maxRankRequired) <= 0, {
  message: 'minRankRequired deve ser menor ou igual a maxRankRequired',
  path: ['minRankRequired'],
});

export const updateScrimSlotSchema = z.object({
  dateTimeStart: z.coerce.date().optional(),
  durationMinutes: z.number().int().min(30).max(300).optional(),
  status: z.enum(SCRIM_SLOT_STATUSES).optional(),
  minRankRequired: rankSchema.optional(),
  maxRankRequired: rankSchema.optional(),
});

export const getScrimSlotsQuerySchema = z.object({
  status: z.enum(SCRIM_SLOT_STATUSES).optional(),
  minRank: rankSchema.optional(),
  maxRank: rankSchema.optional(),
  fromDate: z.coerce.date().optional(),
});

export type CreateScrimSlotInput = z.infer<typeof createScrimSlotSchema>;
export type UpdateScrimSlotInput = z.infer<typeof updateScrimSlotSchema>;
export type GetScrimSlotsQuery = z.infer<typeof getScrimSlotsQuerySchema>;
