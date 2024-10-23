// controllers/campaignController.js
const {Campaign} = require('../models/campaign');

async function getAllCampaigns (req, res) {
    try {
      const campaigns = await Campaign.find().populate('products');
      res.status(200).json(campaigns);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching campaigns', error });
    }
}

// Tạo chiến dịch mới
async function createCampaign (req, res) {
  try {
    const { name, startDate, endDate, products } = req.body;

    const campaign = new Campaign({
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      products: products.map(p => ({
        product: p.product._id,
        discountPrice: p.discountPrice,
      })),
    });

    const savedCampaign = await campaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    res.status(500).json({ message: 'Error creating campaign', error });
  }
};


module.exports = {getAllCampaigns, createCampaign}
