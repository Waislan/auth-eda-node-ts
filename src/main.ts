import { app } from "./server";
import { startKafkaConsumer } from "./infra/kafka/consumer";
import { kafkaProducer } from "./infra/kafka/producer";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

async function bootstrap() {
  try {
    await kafkaProducer.connect();
    console.log("Kafka producer conectado.");

    app.listen(PORT, async () => {
      console.log(`Auth service running on http://localhost:${PORT}`);
      await startKafkaConsumer();
    });
  } catch (err) {
    console.error("Erro ao inicializar aplicação:", err);
    process.exit(1);
  }
}

bootstrap();
