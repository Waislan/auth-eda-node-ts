import express from "express";
import bodyParser from "body-parser";
import { AuthController } from "./adapters/controllers/AuthController";
import { InMemoryUserRepository } from "./repositories/InMemoryUserRepository";
import { RegisterUserUseCase } from "./usecases/RegisterUserUseCase";
import { LoginUseCase } from "./usecases/LoginUseCase";
import { kafkaProducer } from "./infra/kafka/producer";

const app = express();
app.use(bodyParser.json());

const userRepo = new InMemoryUserRepository();

const registerUC = new RegisterUserUseCase(userRepo, kafkaProducer);
const loginUC = new LoginUseCase(userRepo, kafkaProducer);

const authController = new AuthController(registerUC, loginUC);

app.post("/register", (req, res) => authController.register(req, res));
app.post("/login", (req, res) => authController.login(req, res));

export { app };
