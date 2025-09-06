import { type User, type InsertUser, type ContentGeneration, type InsertContentGeneration } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContentGeneration(generation: InsertContentGeneration): Promise<ContentGeneration>;
  getUserContentGenerations(userId?: string): Promise<ContentGeneration[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contentGenerations: Map<string, ContentGeneration>;

  constructor() {
    this.users = new Map();
    this.contentGenerations = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContentGeneration(insertGeneration: InsertContentGeneration): Promise<ContentGeneration> {
    const id = randomUUID();
    const generation: ContentGeneration = {
      ...insertGeneration,
      id,
      createdAt: new Date(),
      metadata: insertGeneration.metadata || null,
      userId: insertGeneration.userId || null,
    };
    this.contentGenerations.set(id, generation);
    return generation;
  }

  async getUserContentGenerations(userId?: string): Promise<ContentGeneration[]> {
    if (!userId) return [];
    return Array.from(this.contentGenerations.values())
      .filter(gen => gen.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const storage = new MemStorage();
