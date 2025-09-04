import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "auth-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:29092"],
});

export const producer = kafka.producer();

export const kafkaProducer = {
  connect: async () => {
    await producer.connect();
  },
  publish: async (topic: string, message: any) => {
    try {
      await producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
    } catch (err) {
      console.error("Kafka publish error", err);
    }
  },
};
