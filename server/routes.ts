import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateText, generateImage } from "./services/aiService";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  const textGenerationSchema = z.object({
    prompt: z.string().min(1, "Prompt is required"),
    contentType: z.string().optional(),
    tone: z.string().optional(),
    length: z.string().optional(),
  });

  const imageGenerationSchema = z.object({
    prompt: z.string().min(1, "Prompt is required"),
    style: z.string().optional(),
    aspectRatio: z.string().optional(),
    quality: z.string().optional(),
  });

  // Text generation endpoint
  app.post("/api/ai/text", async (req, res) => {
    try {
      const validatedData = textGenerationSchema.parse(req.body);
      
      const result = await generateText(validatedData);
      
      // Store the generation (without user for now since we don't have auth)
      await storage.createContentGeneration({
        userId: null,
        type: "text",
        prompt: validatedData.prompt,
        result,
        metadata: {
          contentType: validatedData.contentType,
          tone: validatedData.tone,
          length: validatedData.length,
        },
      });
      
      res.json({ text: result, success: true });
    } catch (error) {
      console.error("Text generation error:", error);
      const message = error instanceof Error ? error.message : "Failed to generate text";
      res.status(500).json({ error: message, success: false });
    }
  });

  // Image generation endpoint
  app.post("/api/ai/image", async (req, res) => {
    try {
      const validatedData = imageGenerationSchema.parse(req.body);
      
      const imageUrl = await generateImage(validatedData);
      
      // Store the generation
      await storage.createContentGeneration({
        userId: null,
        type: "image", 
        prompt: validatedData.prompt,
        result: imageUrl,
        metadata: {
          style: validatedData.style,
          aspectRatio: validatedData.aspectRatio,
          quality: validatedData.quality,
        },
      });
      
      res.json({ url: imageUrl, success: true });
    } catch (error) {
      console.error("Image generation error:", error);
      const message = error instanceof Error ? error.message : "Failed to generate image";
      res.status(500).json({ error: message, success: false });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
