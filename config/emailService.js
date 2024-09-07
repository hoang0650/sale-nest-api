const nodemailer = require('nodemailer');

const sendEmail = (toEmail, order) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'hoang.ph2158@sinhvien.hoasen.edu.vn',
      pass: 'qzhobjzjkvmoyovv',
    },
  });

  const orderDetails = order.items.map(item => {
    return `- Tên sản phẩm: ${item.name}\n  Số lượng: ${item.quantity}\n  Giá: ${formatNumber(item.price)} VND`;
  }).join('\n');

  const mailOptions = {
    from: 'hoang.ph2158@sinhvien.hoasen.edu.vn',
    to: toEmail,
    subject: `Xác nhận đơn hàng ${order.orderId}`,
    text: `Cảm ơn bạn đã đặt hàng!\n\nChi tiết đơn hàng của bạn:\n\nMã đơn hàng: ${order.orderId}\n\nSản phẩm:\n${orderDetails}\n\nTổng tiền: ${formatNumber(order.totalPrice)} VND`,
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

module.exports = sendEmail;
