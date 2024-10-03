const {Revenue} = require('../models/revenue');

// Lấy doanh thu theo ngày
async function revenuePerDay (req, res) {
  const { date } = req.params;
  const startDate = new Date(date);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);

  try {
    const revenue = await Revenue.aggregate([
      { $match: { date: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    res.json({ total: revenue.length > 0 ? revenue[0].total : 0 });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {revenuePerDay}
