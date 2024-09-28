const { User } = require('../models/user')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
dotenv.config()

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
    login
}