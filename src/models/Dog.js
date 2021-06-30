const mongoose = require('mongoose');

const DogSchema = new mongoose.Schema({
  name: String,
  age: String,
  page: String,
  gender: String,
  pic: String,
  description: String
});

module.exports =  mongoose.model('Dog', DogSchema, 'dogs');
