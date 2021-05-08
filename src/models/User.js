const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: String,
  username: String,
  firstName: String,
  lastName: String,
  hash: String,
});

module.exports =  mongoose.model('User', UserSchema);
