const bcrypt = require('bcrypt');

async function decryptPassword(userPassword, hashedPassword) {
    const result = await bcrypt.compare(userPassword, hashedPassword);
    return result;
}

module.exports = {
    decryptPassword
};
