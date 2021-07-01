const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  name: String,
  age: String,
  page: String,
  gender: String,
  pic: String,
  tags: [String],
  type: {
      type: String,
      index: true
  },
  description: String
}, { timestamps: true });

module.exports =  mongoose.model('Pet', PetSchema, 'pets');
