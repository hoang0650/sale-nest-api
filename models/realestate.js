const mongoose = require('mongoose');

const realestateSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    title: { type: String },
    description: { type: String },
    price: { type: Number },
    acreage: {type: String},
    address: { type: String },
    floors: { type: Number },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    area: { type: Boolean },
    type: { type: String },
    status: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }

});

const RealEstate = mongoose.model('RealEstate', realestateSchema);
module.exports = { RealEstate }