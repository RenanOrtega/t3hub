import { z } from 'zod';

const SCRIM_REQUEST_STATUSES = ['Pending', 'Accepted', 'Rejected'] as const;

export const createScrimRequestSchema = z.object({
  slotId: z.string().uuid(),
  requestingTeamId: z.string().uuid(),
  requestMessage: z.string().max(1000).optional(),
});

export const updateScrimRequestSchema = z.object({
  status: z.enum(SCRIM_REQUEST_STATUSES),
});

export type CreateScrimRequestInput = z.infer<typeof createScrimRequestSchema>;
export type UpdateScrimRequestInput = z.infer<typeof updateScrimRequestSchema>;
