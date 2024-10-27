const express = require('express');
const client = require("./services/userService.js");
const kafkaService = require("./services/kafkaService.js");

const app = express();
app.use(express.json());

app.post('/users', async (req, res) => {
  const { email, username, phone } = req.body;

  if (!email || !username) {
    return res.status(400).json({ error: 'Email and username are required' });
  }

  try {
    const createdAt = new Date().toISOString()
    const payload = { username, email, phone, createdAt }
    const createUser = new Promise((resolve, reject) => {
      client.CreateUser(payload, (err, data) => { if (err) reject(err); else resolve(data); })
    });
    const result = await createUser
    const key = result.id
    const message = { ...payload, id: result.id }
    await kafkaService.sendMessageCreateUser(key, message)
    res.json({ message: 'User created and message sent to Kafka' });
  } catch (error) {
    console.error('POST users:', error);
    res.status(500).json({ message: error });
  }
});

app.get('/users', async (req, res) => {
  try {
    const getUsers = new Promise((resolve, reject) => {
      client.getUsers({}, (err, data) => { if (err) reject(err); else resolve(data); })
    });
    const response = await getUsers
    res.json(response);
  } catch (error) {
    console.error('GET users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log('API Gateway running on port 3000');
});
