import { Request, Response } from "express";
import { RegisterUserUseCase } from "../../usecases/RegisterUserUseCase";
import { LoginUseCase } from "../../usecases/LoginUseCase";
import { z } from "zod";

const registerBody = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
const loginBody = z.object({ email: z.string().email(), password: z.string() });

export class AuthController {
  constructor(
    private registerUC: RegisterUserUseCase,
    private loginUC: LoginUseCase
  ) {}

  async register(req: Request, res: Response) {
    try {
      const { email, password } = registerBody.parse(req.body);
      const result = await this.registerUC.execute(email, password);
      return res.status(201).json(result);
    } catch (err: any) {
      console.error(err);
      return res
        .status(err?.statusCode || 500)
        .json({ message: err?.message || "Internal error" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = loginBody.parse(req.body);
      const result = await this.loginUC.execute(email, password);
      return res.json(result);
    } catch (err: any) {
      console.error(err);
      return res
        .status(err?.statusCode || 500)
        .json({ message: err?.message || "Internal error" });
    }
  }
}
