var express = require('express');
var router = express.Router();
const { getUserInfo, createUser, login, applyVoucher, updateAvatar, updateCoverPhoto, createPost, getFriends, getPost } = require('../controllers/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username for the new user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address for the new user
 *               password:
 *                 type: string
 *                 description: Password for the new user
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: User ID
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: User's email address
 *                 username:
 *                   type: string
 *                   description: Username
 *       500:
 *         description: Internal server error
 */

router.post('/signup', createUser);
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Login success message
 *                 token:
 *                   type: string
 *                   description: Authentication token
 *       400:
 *         description: Invalid credentials or password
 *       401:
 *         description: Unauthorized, user not found
 *       500:
 *         description: Internal server error
 */

router.post('/login', login);
/**
 * @swagger
 * /users/info:
 *   get:
 *     summary: Get user information based on JWT token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: User ID
 *                 username:
 *                   type: string
 *                   description: Username
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: User's email address
 *                 blocked:
 *                   type: boolean
 *                   description: User's block status
 *                 role:
 *                   type: string
 *                   description: User's role
 *       401:
 *         description: Unauthorized, invalid or expired token
 *       500:
 *         description: Internal server error
 */

router.get('/info', getUserInfo);

router.post('/apply-voucher', applyVoucher);

router.put('/:id/avatar', updateAvatar);

router.put('/:id/cover', updateCoverPhoto);

router.post('/posts', createPost);

router.get('/:id/friends', getFriends);

router.get('/:id/posts', getPost);

module.exports = router;