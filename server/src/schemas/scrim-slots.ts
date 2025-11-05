import { z } from 'zod';

const SCRIM_SLOT_STATUSES = ['Open', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as const;

export const createScrimSlotSchema = z.object({
  hostTeamId: z.string().uuid(),
  dateTimeStart: z.coerce.date(),
  durationMinutes: z.number().int().min(30).max(300),
  minEloRequired: z.number().int().min(0).max(5000),
  maxEloRequired: z.number().int().min(0).max(5000),
}).refine((data) => data.minEloRequired <= data.maxEloRequired, {
  message: 'minEloRequired must be less than or equal to maxEloRequired',
  path: ['minEloRequired'],
});

export const updateScrimSlotSchema = z.object({
  dateTimeStart: z.coerce.date().optional(),
  durationMinutes: z.number().int().min(30).max(300).optional(),
  status: z.enum(SCRIM_SLOT_STATUSES).optional(),
  minEloRequired: z.number().int().min(0).max(5000).optional(),
  maxEloRequired: z.number().int().min(0).max(5000).optional(),
});

export const getScrimSlotsQuerySchema = z.object({
  status: z.enum(SCRIM_SLOT_STATUSES).optional(),
  minElo: z.coerce.number().int().min(0).optional(),
  maxElo: z.coerce.number().int().max(5000).optional(),
  fromDate: z.coerce.date().optional(),
});

export type CreateScrimSlotInput = z.infer<typeof createScrimSlotSchema>;
export type UpdateScrimSlotInput = z.infer<typeof updateScrimSlotSchema>;
export type GetScrimSlotsQuery = z.infer<typeof getScrimSlotsQuerySchema>;
