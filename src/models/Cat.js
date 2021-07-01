const mongoose = require('mongoose');

const CatSchema = new mongoose.Schema({
  name: String,
  age: String,
  page: String,
  gender: String,
  pic: String,
  description: String
});

module.exports =  mongoose.model('Cat', CatSchema, 'cats');
