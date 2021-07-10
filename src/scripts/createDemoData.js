require('dotenv').config();
const userService = require('../apis/user/userService');
const mongoose = require('../utils/dbConnection');
function createDemoPets() {}

async function createDemoUser() {
    // "savedPets" : [ObjectId("60de2f8dc2ffbbc1b1236007"), ObjectId("60de2fcfc2ffbbc1b1236029"), ObjectId("60de3023c2ffbbc1b123604f")],
    await userService.createUser({
        email: 'test@example.com',
        name: 'בדיקה',
        password: '12345'
    });
}

mongoose.connection.on('connected', async (err) => {
    const user = await createDemoUser();
    console.log('Created User', user);
});
