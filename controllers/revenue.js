const {Revenue} = require('../models/revenue');
const {Order} = require('../models/order')
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
      groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
      break;
    case 'weekly':
      startDate.setDate(startDate.getDate() - 84);
      groupBy = { 
        $concat: [
          { $toString: { $isoWeek: "$createdAt" } },
          "-",
          { $toString: { $year: "$createdAt" } }
        ]
      };
      break;
    case 'monthly':
      startDate.setMonth(startDate.getMonth() - 12);
      groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
      break;
    case 'yearly':
      startDate.setFullYear(startDate.getFullYear() - 5);
      groupBy = { $dateToString: { format: "%Y", date: "$createdAt" } };
      break;
    default:
      return res.status(400).json({ error: 'Invalid period' });
  }

  try {
    // Fetch completed orders and group by the specified period
    const completedOrders = await Order.aggregate([
      { 
        $match: { 
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: groupBy,
          totalAmount: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fetch existing revenue data
    const existingRevenues = await Revenue.aggregate([
      { $match: { date: { $gte: startDate } } },
      { $group: { _id: groupBy, amount: { $sum: "$amount" } } },
      { $sort: { _id: 1 } }
    ]);

    // Combine completed orders revenue with existing revenue data
    const combinedRevenues = completedOrders.map(order => {
      const existingRevenue = existingRevenues.find(rev => rev._id === order._id);
      return {
        date: order._id,
        amount: (existingRevenue ? existingRevenue.amount : 0) + order.totalAmount
      };
    });

    // Add any existing revenue data that doesn't have corresponding completed orders
    existingRevenues.forEach(rev => {
      if (!combinedRevenues.some(cr => cr.date === rev._id)) {
        combinedRevenues.push({ date: rev._id, amount: rev.amount });
      }
    });

    // Sort the combined revenues
    combinedRevenues.sort((a, b) => {
      if (a.date === null || b.date === null) return 0;
      return a.date.localeCompare(b.date);
    });

    res.json({ revenues: combinedRevenues });
  } catch (error) {
    console.error('Error calculating revenue:', error);
    res.status(500).json({ error: "Error calculating revenue" });
  }
};

module.exports = {revenuePerDay,addRevenue}
