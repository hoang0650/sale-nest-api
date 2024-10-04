const mongoose = require('mongoose');

const RevenueSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  amount: { type: [Number], required: true },
});

const Revenue = mongoose.model('Revenue', RevenueSchema);
module.exports = {Revenue};
