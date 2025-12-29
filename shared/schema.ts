import { z } from "zod";

// Data Models
export const videoRequestSchema = z.object({
  id: z.string(),
  senderName: z.string().min(1, "Le nom de l'expéditeur est requis"),
  receiverName: z.string().min(1, "Le nom du destinataire est requis"),
  message: z.string().min(1, "Le message est requis").max(1000, "Message trop long (max 1000 mots)"),
  music: z.string().default("romantic"),
  customMusicUrl: z.string().optional(),
  status: z.enum(["pending", "processing", "completed", "failed"]).default("pending"),
  progress: z.number().default(0),
  videoUrl: z.string().optional(),
  createdAt: z.string(), // ISO String
});

export type VideoRequest = z.infer<typeof videoRequestSchema>;

// Input Schemas
export const createVideoRequestSchema = videoRequestSchema.pick({
  senderName: true,
  receiverName: true,
  message: true,
  music: true,
}).extend({
  customMusicUrl: z.string().optional(),
});

export type CreateVideoRequest = z.infer<typeof createVideoRequestSchema>;
