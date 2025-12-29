
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { processVideo } from "./video-processor";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import multer from "multer";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "client", "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, "audio-" + uniqueSuffix + ext);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("audio/")) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files are allowed"));
    }
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/upload-music", upload.single("file"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
  });
  
  app.post(api.requests.create.path, async (req, res) => {
    try {
      const input = api.requests.create.input.parse(req.body);
      // Validate word count (max 1000 words)
      const wordCount = input.message.trim().split(/\s+/).length;
      if (wordCount > 1000) {
        return res.status(400).json({ message: "Le message ne doit pas dépasser 1000 mots." });
      }
      const request = await storage.createRequest(input);
      
      // Instant completion for the new "beautiful page" flow
      await storage.updateStatus(request.id, "completed", 100, `/result/${request.id}`);

      res.status(201).json(request);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.get(api.requests.get.path, async (req, res) => {
    const request = await storage.getRequest(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.json(request);
  });

  app.get(api.requests.status.path, async (req, res) => {
    const request = await storage.getRequest(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.json({
      status: request.status,
      progress: request.progress,
      videoUrl: request.videoUrl
    });
  });

  app.get("/api/requests/:id/video", async (req, res) => {
    const request = await storage.getRequest(req.params.id);
    if (!request || request.status !== "completed") {
      return res.status(404).json({ message: "Video not found" });
    }
    
    // Serve a simple HTML page that looks like a video preview 
    // since we are in MVP mode and don't generate real MP4s yet
    res.setHeader("Content-Type", "text/html");
    res.send(`
      <html>
        <body style="background: black; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
          <h1>Vidéo de ${request.senderName} pour ${request.receiverName}</h1>
          <p style="font-size: 1.5rem; max-width: 600px; text-align: center; font-style: italic;">"${request.message}"</p>
          <div style="margin-top: 2rem; border: 2px solid pink; padding: 2rem; border-radius: 1rem;">
            🎶 Musique: ${request.music}
          </div>
          <p style="margin-top: 2rem; color: #666;">Ceci est un aperçu généré pour votre démonstration.</p>
        </body>
      </html>
    `);
  });

  return httpServer;
}
