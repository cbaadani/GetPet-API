const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  hash: String,
  savedPets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }]
}, { timestamps: true });

module.exports =  mongoose.model('User', UserSchema, 'users');
