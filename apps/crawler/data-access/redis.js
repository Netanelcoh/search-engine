const {createClient} = require('redis');

const client = createClient({
    socket: {
        reconnectStrategy: false
        //retries => Math.min(retries * 50, 5000)
        }
});

client.on('error', err => console.log('Redis Client Error', err));


client.connect()
    .then(() =>  console.log("Connected to Redis"))
    //.catch(error => console.log("Error connection to Redis", error));
    

module.exports = client;

