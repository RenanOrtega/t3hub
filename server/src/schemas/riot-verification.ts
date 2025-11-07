import { z } from "zod";

const LANES = ["Top", "Jungle", "Mid", "ADC", "Support"] as const;

export const generateVerificationSchema = z.object({
  gameName: z.string().min(3).max(16),
  tagLine: z.string().min(3).max(5),
});

export const verifyAccountSchema = z.object({
  gameName: z.string().min(3).max(16),
  tagLine: z.string().min(3).max(5),
  verificationIconId: z.number().int().min(1),
  primaryLane: z.enum(LANES),
  secondaryLane: z.enum(LANES),
  discordTag: z.string().min(3).max(255),
});

export type GenerateVerificationInput = z.infer<typeof generateVerificationSchema>;
export type VerifyAccountInput = z.infer<typeof verifyAccountSchema>;
