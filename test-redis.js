require('dotenv').config();
const redis = require('redis');

const client = redis.createClient({
  url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  try {
    await client.connect();
    console.log('Connected to Redis');
    await client.set('test', 'Hello from Captain MEMO');
    const value = await client.get('test');
    console.log('Redis test value:', value);
    await client.disconnect();
  } catch (err) {
    console.error('Redis connection failed:', err);
  }
})();
