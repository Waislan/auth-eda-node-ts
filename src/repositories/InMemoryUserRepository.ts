import { User } from "../domain/entities/User";

export class InMemoryUserRepository {
  private users = new Map<string, User>();

  async findByEmail(email: string): Promise<User | null> {
    for (const u of this.users.values()) {
      if (u.email === email) return u;
    }
    return null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }
}
