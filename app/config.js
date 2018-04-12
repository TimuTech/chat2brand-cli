let config = {};

config.cache = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS
};

config.api = {
    channel_id: process.env.API_WA_CHANNEL,
    url: process.env.API_URL,
    token: process.env.API_TOKEN
}

module.exports = config;