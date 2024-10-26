const { promisify } = require('util');

const TOPICS = {
  USER_REGISTRATION: 'USER_REGISTRATION'
}

const EVENT_TYPE = {
  USER_REGISTRATION_EVT: 'USER_REGISTRATION_EVT',
}

function promisifyAll(client) {
  const to = {};
  for (var k in client) {
      if (typeof client[k] != 'function') continue;
      to[k] = promisify(client[k].bind(client));
  }
  return to;
}

module.exports = {
  TOPICS,
  EVENT_TYPE,
  promisifyAll
};
