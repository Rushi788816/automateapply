import { Injectable, OnModuleInit } from "@nestjs/common";
import { ensureSchema } from "./schema";

@Injectable()
export class DatabaseService implements OnModuleInit {
  async onModuleInit() {
    try {
      await ensureSchema();
    } catch (error) {
      // Allow API to start; endpoints will fail until DB is reachable.
      // eslint-disable-next-line no-console
      console.error("Database init failed:", error);
    }
  }
}
