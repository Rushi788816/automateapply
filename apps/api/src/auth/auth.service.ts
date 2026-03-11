import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { createId, memory } from "../common/memory";
import { query } from "../common/db";

type AuthUser = {
  id: string;
  email: string;
  createdAt: string;
  orgId: string;
};

type AuthResponse = {
  user: AuthUser;
  token: string;
};

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(email: string, password: string): Promise<AuthResponse> {
    return this.createOrLogin(email, password, true);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.createOrLogin(email, password, false);
  }

  async oauth(email: string): Promise<AuthResponse> {
    const result = await query(
      "SELECT id, email, password_hash, created_at, org_id FROM users WHERE email = $1",
      [email],
    );
    if (result.rows.length > 0) {
      const row = result.rows[0];
      return this.issueToken({
        id: row.id,
        email: row.email,
        createdAt: row.created_at,
        orgId: row.org_id,
      });
    }

    const orgId = createId();
    const id = createId();
    const passwordHash = await bcrypt.hash(createId(), 10);
    const createdAt = new Date().toISOString();
    await query("INSERT INTO orgs (id, name) VALUES ($1, $2)", [
      orgId,
      "Personal Workspace",
    ]);
    await query(
      "INSERT INTO users (id, email, password_hash, org_id, created_at) VALUES ($1, $2, $3, $4, $5)",
      [id, email, passwordHash, orgId, createdAt],
    );
    return this.issueToken({ id, email, createdAt, orgId });
  }

  logout(token: string): { ok: boolean } {
    memory.sessions.delete(token);
    return { ok: true };
  }

  private issueToken(user: AuthUser): AuthResponse {
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      orgId: user.orgId,
    });
    return { user, token };
  }

  private async createOrLogin(
    email: string,
    password: string,
    allowCreate: boolean,
  ): Promise<AuthResponse> {
    const result = await query(
      "SELECT id, email, password_hash, created_at, org_id FROM users WHERE email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      if (!allowCreate) {
        return {
          user: { id: "invalid", email, createdAt: "", orgId: "" },
          token: "",
        };
      }

      const orgId = createId();
      const id = createId();
      const passwordHash = await bcrypt.hash(password, 10);
      const createdAt = new Date().toISOString();
      await query("INSERT INTO orgs (id, name) VALUES ($1, $2)", [
        orgId,
        "Personal Workspace",
      ]);
      await query(
        "INSERT INTO users (id, email, password_hash, org_id, created_at) VALUES ($1, $2, $3, $4, $5)",
        [id, email, passwordHash, orgId, createdAt],
      );
      return this.issueToken({ id, email, createdAt, orgId });
    }

    const row = result.rows[0];
    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) {
      return {
        user: { id: "invalid", email, createdAt: "", orgId: "" },
        token: "",
      };
    }

    let orgId = row.org_id;
    if (!orgId) {
      orgId = createId();
      await query("INSERT INTO orgs (id, name) VALUES ($1, $2)", [
        orgId,
        "Personal Workspace",
      ]);
      await query("UPDATE users SET org_id = $1 WHERE id = $2", [
        orgId,
        row.id,
      ]);
    }

    return this.issueToken({
      id: row.id,
      email: row.email,
      createdAt: row.created_at,
      orgId,
    });
  }
}
