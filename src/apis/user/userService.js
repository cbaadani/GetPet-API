const User = require('../../models/User');
const { encryptPassword } = require('../../utils/encryptionUtils');

function createUser({ username, password }) {
    const { hash, salt } = encryptPassword(password);
    const newUser = new User({
        username,
        hash,
        salt
    });

    return newUser.save();
}

module.exports = {
    createUser
};
