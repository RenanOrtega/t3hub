import { z } from "zod";

export const addPlayerToRosterSchema = z.object({
  playerId: z.string().uuid(),
});

export const removePlayerFromRosterSchema = z.object({
  playerId: z.string().uuid(),
});

export type AddPlayerToRosterInput = z.infer<typeof addPlayerToRosterSchema>;
export type RemovePlayerFromRosterInput = z.infer<typeof removePlayerFromRosterSchema>;
