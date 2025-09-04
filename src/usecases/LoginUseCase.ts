import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { InMemoryUserRepository } from "../repositories/InMemoryUserRepository";
import { kafkaProducer } from "../infra/kafka/producer";
import { AppError } from "../domain/errors/AppError";

const JWT_SECRET = process.env.JWT_SECRET || "VERY_SECRET_DO_NOT_USE_IN_PROD";

export class LoginUseCase {
  constructor(
    private repo: InMemoryUserRepository,
    private producer = kafkaProducer
  ) {}

  async execute(email: string, password: string) {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new AppError("Invalid credentials", 401);

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new AppError("Invalid credentials", 401);

    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    await this.producer.publish("user.login", {
      userId: user.id,
      email: user.email,
      at: new Date().toISOString(),
    });

    return { token };
  }
}
