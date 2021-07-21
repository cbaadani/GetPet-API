const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  name: String,
  description: String,
  type: {
      type: String,
      index: true
  },
  age: Number,
  gender: String,
  profilePhoto: String,
  tags: [String]
}, { timestamps: true });

module.exports =  mongoose.model('Pet', PetSchema, 'pets');
