
import { type VideoRequest, type CreateVideoRequest } from "@shared/schema";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, "../../data");
const REQUESTS_FILE = path.join(DATA_DIR, "requests.json");

export interface IStorage {
  createRequest(request: CreateVideoRequest): Promise<VideoRequest>;
  getRequest(id: string): Promise<VideoRequest | undefined>;
  updateStatus(id: string, status: VideoRequest["status"], progress: number, url?: string): Promise<VideoRequest>;
}

export class JsonStorage implements IStorage {
  private async ensureDataDir() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }
  }

  private async readRequests(): Promise<Record<string, VideoRequest>> {
    await this.ensureDataDir();
    try {
      const data = await fs.readFile(REQUESTS_FILE, "utf-8");
      return JSON.parse(data);
    } catch (e) {
      return {};
    }
  }

  private async writeRequests(requests: Record<string, VideoRequest>) {
    await this.ensureDataDir();
    await fs.writeFile(REQUESTS_FILE, JSON.stringify(requests, null, 2));
  }

  async createRequest(request: CreateVideoRequest): Promise<VideoRequest> {
    const requests = await this.readRequests();
    const id = Math.random().toString(36).substring(2, 15);
    const newRequest: VideoRequest = {
      ...request,
      id,
      status: "pending",
      progress: 0,
      createdAt: new Date().toISOString(),
      customMusicUrl: (request as any).customMusicUrl || "",
    };
    requests[id] = newRequest;
    await this.writeRequests(requests);
    return newRequest;
  }

  async getRequest(id: string): Promise<VideoRequest | undefined> {
    const requests = await this.readRequests();
    return requests[id];
  }

  async updateStatus(id: string, status: VideoRequest["status"], progress: number, url?: string): Promise<VideoRequest> {
    const requests = await this.readRequests();
    if (!requests[id]) throw new Error("Request not found");
    
    requests[id] = {
      ...requests[id],
      status,
      progress,
      videoUrl: url || requests[id].videoUrl,
    };
    await this.writeRequests(requests);
    return requests[id];
  }
}

export const storage = new JsonStorage();
