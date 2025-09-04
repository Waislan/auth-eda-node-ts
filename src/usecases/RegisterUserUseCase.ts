import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";
import { InMemoryUserRepository } from "../repositories/InMemoryUserRepository";
import { kafkaProducer } from "../infra/kafka/producer";
import { AppError } from "../domain/errors/AppError";

export class RegisterUserUseCase {
  constructor(
    private repo: InMemoryUserRepository,
    private producer = kafkaProducer
  ) {}

  async execute(email: string, password: string) {
    const existing = await this.repo.findByEmail(email);
    if (existing) throw new AppError("Email already in use", 409);

    const passwordHash = await bcrypt.hash(password, 10);
    const id = uuid();
    const user = { id, email, passwordHash, createdAt: new Date() };

    await this.repo.save(user as any);

    await this.producer.publish("user.registered", {
      id,
      email,
      createdAt: user.createdAt.toISOString(),
    });

    return { id, email };
  }
}
