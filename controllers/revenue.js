const {Revenue} = require('../models/revenue');

// Mock data generator
async function addRevenue(req, res) {
  const { date, amount } = req.body;
  try {
    const result = await revenueCollection.insertOne({ date, amount });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error inserting data" });
  }
}
// Lấy doanh thu theo ngày
async function revenuePerDay (req, res) {
  const period = req.params.period;
  let startDate = new Date();
  let groupBy;

  switch (period) {
    case 'daily':
      startDate.setDate(startDate.getDate() - 30);
      groupBy = { $dateToString: { format: "%d-%m-%Y", date: "$date" } };
      break;
    case 'weekly':
      startDate.setDate(startDate.getDate() - 84);
      groupBy = { $dateToString: { format: "%W-%Y", date: "$date" } };
      break;
    case 'monthly':
      startDate.setMonth(startDate.getMonth() - 12);
      groupBy = { $dateToString: { format: "%m-%Y", date: "$date" } };
      break;
    case 'yearly':
      startDate.setFullYear(startDate.getFullYear() - 5);
      groupBy = { $dateToString: { format: "%Y", date: "$date" } };
      break;
    default:
      return res.status(400).json({ error: 'Invalid period' });
  }

  try {
    const revenues = await Revenue.aggregate([
      { $match: { date: { $gte: startDate } } },
      { $group: { _id: groupBy, amount: { $sum: "$amount" } } },
      { $sort: { _id: 1 } }
    ]).toArray();

    res.json({ revenues: revenues.map(r => ({ date: r._id, amount: r.amount })) });
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
};

module.exports = {revenuePerDay,addRevenue}
