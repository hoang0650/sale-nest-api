// models/Campaign.js
const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: String,
  startDate: Date,
  endDate: Date,
  products: [
    {
      product: { type: mongoose.SchemaTypes.ObjectId, ref: 'Product' },
      discountPrice: Number
    }
  ]
});


const Campaign = mongoose.model('Campaign', campaignSchema);
module.exports = { Campaign };