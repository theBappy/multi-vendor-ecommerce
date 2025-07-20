import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
dotenv.config();

export const kafka = new Kafka({
  brokers: [
    'd1u8s3k4tis6701qtieg.any.us-east-1.mpx.prd.cloud.redpanda.com:9092',
  ],
  ssl: true,
  sasl: {
    mechanism: 'SCRAM-SHA-256', 
    username: 'thebappy',
    password: 'eXtwxdh7VSR7zG24p2tcxxMazuq4jf',
  },
});
