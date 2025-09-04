import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "auth-consumer",
  brokers: [process.env.KAFKA_BROKER || "localhost:29092"],
});
const consumer = kafka.consumer({ groupId: "auth-service-group" });

export async function startKafkaConsumer() {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: "user.registered", fromBeginning: true });
    await consumer.subscribe({ topic: "user.login", fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value?.toString();
        if (!value) return;
        const payload = JSON.parse(value);
        console.log("[consumer] topic:", topic, "payload:", payload);

        if (topic === "user.registered") {
          console.log(
            `[consumer] Enviando e-mail de boas-vindas para ${payload.email}`
          );
        }

        if (topic === "user.login") {
            console.log(
              `[consumer] Registrando login do usuário ${payload.email}`
            );
          }
      },
    });
  } catch (err) {
    console.error("Error starting kafka consumer", err);
  }
}
