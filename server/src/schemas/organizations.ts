import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(255),
  contactInfo: z.string().max(500).optional(),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

export const getOrganizationsQuerySchema = z.object({
  search: z.string().optional(),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type GetOrganizationsQuery = z.infer<typeof getOrganizationsQuerySchema>;
