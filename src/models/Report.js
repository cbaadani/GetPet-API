const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  location: String,
  description: String,
  image: String,
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports =  mongoose.model('Report', ReportSchema, 'reports');
