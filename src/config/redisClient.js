const redis = require('redis')

const { exit } = require('node:process');

const client = redis.createClient()

client.on('error', (err) => {
    console.log('Redis client error:', err)
    exit(1)
})

module.exports = client