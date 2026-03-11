import { Injectable } from "@nestjs/common";
import { createId } from "../common/memory";
import { query } from "../common/db";

type Org = {
  id: string;
  name: string;
  createdAt: string;
};

@Injectable()
export class OrgsService {
  async get(id: string): Promise<Org | null> {
    const result = await query(
      "SELECT id, name, created_at FROM orgs WHERE id = $1",
      [id],
    );
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return { id: row.id, name: row.name, createdAt: row.created_at };
  }

  async create(name: string): Promise<Org> {
    const org: Org = {
      id: createId(),
      name,
      createdAt: new Date().toISOString(),
    };
    await query("INSERT INTO orgs (id, name, created_at) VALUES ($1, $2, $3)", [
      org.id,
      org.name,
      org.createdAt,
    ]);
    return org;
  }

  async list(orgId: string): Promise<Org[]> {
    const result = await query(
      "SELECT id, name, created_at FROM orgs WHERE id = $1",
      [orgId],
    );
    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      createdAt: row.created_at,
    }));
  }
}
