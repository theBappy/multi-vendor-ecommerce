import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
dotenv.config();

export const kafka = new Kafka({
  clientId: "d1usoqc4tis6701qu190",
  brokers: ["d1usoqc4tis6701qu190.any.us-east-1.mpx.prd.cloud.redpanda.com:9092"],
  ssl: true,
  sasl: {
    mechanism: "scram-sha-512",
    username: "my-kafka-user", 
    password: "gyrQ9FSl2n7l6w44pQ5m2WhzBlWpw1",
  },
});


