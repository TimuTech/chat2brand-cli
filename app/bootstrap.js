require('dotenv').config();

/* -- prepare config -- */
global.config = require("./config");
/* -- prepare cache -- */
const { promisify } = require('util');
global.redis = require("redis");
global.cache = redis.createClient(config.cache);
global.cache.getAsync = (key) => {
    return new Promise((resolve, reject) => {
        cache.get(key, function(error, value) {
            if (error) reject(error);
            else resolve(value);
        }); 
    })
}
global.cache.setAsync = (key, value, timeout) => {
    return new Promise((resolve, reject) => {
        cache.set(key, value, 'EX', timeout, function(error, result) {
            if (error) reject(error);
            else resolve(result);
        }); 
    })
}
//global.cache.setAsync = promisify(cache.set).bind(cache); 
/* -- prepare http client -- */
global.axios = require('axios');
axios.defaults.headers.common = {
    'Authorization': config.api.token,
};
/* -- prepare events -- */
global.EventBus = new (require('events'))();