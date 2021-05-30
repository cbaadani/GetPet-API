const mongoose = require('mongoose');

const PserSchema = new mongoose.Schema({
  name: String,
  age: String,
  breed: String
});

module.exports =  mongoose.model('Pet', PetSchema);
