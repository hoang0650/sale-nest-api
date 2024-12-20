const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendEmail = (toEmail, order) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'hoang.ph2158@sinhvien.hoasen.edu.vn',
      pass: 'qzhobjzjkvmoyovv',
    },
    // host: 'mail.privateemail.com',
    // port: 465,
    // secure: true,
    // auth: {
    //   user: process.env.EMAIL_USER,
    //   pass: process.env.EMAIL_PASS,
    // },
  });

  const orderDetails = order.items.map(item => {
    return `- Tên sản phẩm: ${item.name}\n  Số lượng: ${item.quantity}\n  Kích thước: ${item.variants.size}\n  Màu sắc/Loại: ${item.variants.color}\n Giá: ${formatNumber(item.price)} VND`;
  }).join('\n');

  const mailOptions = {
    from: 'noreply@nintshop.com',
    to: toEmail,
    subject: `Xác nhận đơn hàng ${order.orderId}`,
    text: `Cảm ơn bạn đã đặt hàng!\n\nChi tiết đơn hàng của bạn:\n\nMã đơn hàng: ${order.orderId}\n\nSản phẩm:\n${orderDetails}\n\nThành tiền: ${formatNumber(order.subtotal)} VNĐ\n\nGiảm giá: ${formatNumber(order.discount)} VNĐ\n\nTổng tiền: ${formatNumber(order.totalPrice)} VND`,
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
