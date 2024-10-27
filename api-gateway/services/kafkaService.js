const { Kafka, Partitioners } = require('kafkajs');
const { TOPICS, EVENT_TYPE } = require('../common');

const source = 'api-gateway'

const kafkaService = new Kafka({
  clientId: 'api-gateway',
  brokers: [process.env.KAFKA_HOST || 'localhost:29092'],
  retry: {
    retries: 8,
    initialRetryTime: 300,
  },
});

const producer = kafkaService.producer({ createPartitioner: Partitioners.LegacyPartitioner });

kafkaService.sendMessageCreateUser = async (key, value) => {
  await producer.connect();
  const message = {
    key: key,
    value: JSON.stringify(value),
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
}

module.exports = kafkaService