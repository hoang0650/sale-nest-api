const { User } = require('../models/user')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
dotenv.config()

// Định nghĩa mã voucher hợp lệ
const validVouchers = {
    'DISCOUNT10': 10,  // Giảm 10%
    'SUMMER20': 20     // Giảm 20%
};

async function applyVoucher(req, res) {
    const { userId, voucherCode } = req.body;

    // Kiểm tra tính hợp lệ của mã voucher
    if (!(voucherCode in validVouchers)) {
        return res.status(400).json({ message: 'Invalid voucher code.' });
    }

    try {
        // Tìm người dùng trong cơ sở dữ liệu
        const user = await User.findOne({ userId });

        // Kiểm tra xem người dùng có tồn tại không
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Kiểm tra xem voucher đã được sử dụng chưa
        if (user.usedVouchers.includes(voucherCode)) {
            return res.status(400).json({ message: 'You have already used this voucher.' });
        }

        // Nếu voucher hợp lệ và chưa được sử dụng, thêm voucher vào danh sách đã sử dụng
        user.usedVouchers.push(voucherCode);
        await user.save(); // Lưu thông tin người dùng vào cơ sở dữ liệu

        const discount = validVouchers[voucherCode];
        res.status(200).json({ 
            message: `Voucher applied successfully. You received a ${discount}% discount.` 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

async function getUserInfo(req, res) {
    const token = req.headers.authorization.split(' ')[1];
    await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Token không hợp lệ hoặc đã hết hạn
            console.error('Invalid token:', err.message);
        } else {
            // Token hợp lệ, decoded chứa payload
            res.json(decoded);
        }
    })
}


async function createUser(req, res) {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    function generateUniqueUserId() {
        return Date.now().toString() + Math.floor(Math.random() * 1000);
    }
    User.create({ userId: generateUniqueUserId(), email: email, username: username, password: hashedPassword }).then(data => {
        res.status(200).send(data)
    }).catch(err => res.status(500).json({ err }))
}

function login(req, res) {
    const { password, email } = req.body;
    User.findOne({ email }).then(
        user => {
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) return res.status(500).send('Error comparing passwords: ' + err);
                if (!isMatch) return res.status(400).send('Invalid password');
                console.log('user', user);
                const payloadData = {
                    userId: user.userId,
                    username: user.username,
                    email: user.email,
                    blocked: user.blocked,
                    role: user.role
                }
                const token = jwt.sign(payloadData, process.env.JWT_SECRET, {
                    expiresIn: '30d'
                })
                const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                user.online = true
                user.loginHistory.push({ loginDate: new Date(), ipAddress });
                user.save()
                    .then(() => res.send({ message: 'Login successful', token }))
                    .catch(err => res.status(500).send('Error updating login history: ' + err));
            })
        })
        .catch(err => res.status(500).send('Error finding user: ' + err));
}

module.exports = {
    getUserInfo,
    createUser,
    login,
    applyVoucher
}