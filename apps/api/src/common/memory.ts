import { randomUUID } from "crypto";

export const memory = {
  sessions: new Map<string, string>(),
};

export function createId(): string {
  return randomUUID();
}
