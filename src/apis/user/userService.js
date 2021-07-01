const User = require('../../models/User');
const { encryptPassword } = require('../../utils/encryptionUtils');
const { decryptPassword } = require('../../utils/decryptionUtils');


/**
 * Creates a user and adds it to the db
 * @param {{ username: string; password: string; }} options 
 * @returns 
 */
async function createUser({ email, username, firstName, lastName, password }) {
    const hash = await encryptPassword(password);
    const newUser = new User({
        email,
        username,
        firstName,
        lastName,
        hash
    });

    return newUser.save();
}

async function checkUser({ email, password }) {
    const exists = await userExists({ email })
    if (exists) {
        const userFound = await User.findOne({ "email": email });
        const isMatch = await decryptPassword(password, userFound.hash);
        return isMatch;
    }
    return false;
}

async function userExists({ email }) {
    const isExist = await User.exists({ email: email });
    return isExist;
}

async function updateUser(id, reqBody){
    const updatedUser = User.findByIdAndUpdate(id, reqBody, {new: true});
    return updatedUser;
}

async function getUserByEmail({email}){
    const userFound = await User.findOne({ "email": email });
    return userFound;
}

module.exports = {
    createUser,
    checkUser,
    userExists,
    updateUser,
    getUserByEmail
};
