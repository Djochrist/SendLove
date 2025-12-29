import { z } from "zod";
import { videoRequestSchema, createVideoRequestSchema } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  requests: {
    create: {
      method: "POST" as const,
      path: "/api/requests",
      input: createVideoRequestSchema,
      responses: {
        201: videoRequestSchema,
        400: errorSchemas.validation,
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/requests/:id",
      responses: {
        200: videoRequestSchema,
        404: errorSchemas.notFound,
      },
    },
    status: {
      method: "GET" as const,
      path: "/api/requests/:id/status",
      responses: {
        200: videoRequestSchema.pick({ status: true, progress: true, videoUrl: true }),
        404: errorSchemas.notFound,
      },
    },
    uploadMusic: {
      method: 'POST' as const,
      path: '/api/upload-music',
      responses: {
        201: z.object({ url: z.string() }),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
