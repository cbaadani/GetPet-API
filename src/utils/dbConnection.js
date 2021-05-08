const mongoose = require('mongoose');
const { awaitableTimeout } = require('./timerUtils');
const url = 'mongodb://127.0.0.1:27017/GetPetDB';

// reconnect db when there is an initial connection error
const max_retries = 3;

/**
 * Connect to mongoose
 * @param {number} retries 
 * @returns 
 */
async function connect(retries = 1) {
    try {
        console.log(`Connecting to MongoDB...`);
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch (error) {
        if (retries < max_retries) {
            console.error(`Failed to connect to MongoDB, retrying in 5 seconds - retry number ${retries}`);
            await awaitableTimeout(() => connect(retries + 1), 5000);
            return;
        }

        console.error(`Failed to connect to MongoDB, retried ${max_retries} times`);
        process.exit(1);
    }
}

connect();

mongoose.connection.on('disconnected', err => {
    console.log('DB disconnected');
});

mongoose.connection.on('connected', err => {
    console.log('DB connected successfully!');
});

module.exports = mongoose;
