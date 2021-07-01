const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  hash: String,
}, { timestamps: true });

module.exports =  mongoose.model('User', UserSchema, 'users');
