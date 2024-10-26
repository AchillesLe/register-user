const express = require('express');
const { Kafka, Partitioners } = require('kafkajs');
const { TOPICS, EVENT_TYPE } = require('./common/index.js');
const { promisify } = require('util');

const client = require("./userService.js");

const app = express();
app.use(express.json());

const source = 'api-gateway'

const kafka = new Kafka({
  clientId: 'api-gateway',
  brokers: [process.env.KAFKA_HOST || 'localhost:29092'],
  retry: {
    retries: 8,
    initialRetryTime: 300,
  },
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner
});

app.post('/create-user', async (req, res) => {
  const { email, username } = req.body;

  if (!email || !username) {
    return res.status(400).json({ error: 'Email and username are required' });
  }

  try {
    await producer.connect();
    const message = {
      key: 'user-123',
      value: JSON.stringify({
        user_id: 'user-123',
        username:username,
        email: email,
        created_at: new Date().toISOString()
      }),
      headers: {
        eventType: EVENT_TYPE.USER_REGISTRATION_EVT,
        source: source,
        contentType: "application/json",
      }
    };
    await producer.send({
      topic: TOPICS.USER_REGISTRATION,
      messages: [message],
    });
    await producer.disconnect()
  } catch (error) {
    console.error('Error sending message', error);
  }

  res.json({ message: 'User created and message sent to Kafka' });
});

app.get('/users', async (req, res) => {
  try {
    const getUsers = new Promise((resolve, reject) => {
      client.getUsers({}, (err, users) => {
        if (err) reject(err);
        else resolve(users);
        return users
      })
    });
    const response = await getUsers
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log('API Gateway running on port 3000');
});
