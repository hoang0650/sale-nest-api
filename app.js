var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const connectDB = require('./config/config');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');
var orderRouter = require('./routes/order');
var contactRouter = require('./routes/contact');
var fileRouter = require('./routes/file');
var webhookRouter = require('./routes/webhook');
var reviewRoutes = require('./routes/review');
var revenueRoutes = require('./routes/revenue');
var walletRoutes = require('./routes/wallet');
var videoRoutes = require('./routes/video');
var creatorRoutes = require('./routes/creator');
var blogRoutes = require('./routes/blog');
var campaignRoutes = require('./routes/campaign');
var audioRoutes = require('./routes/audio');
var serviceRoutes = require('./routes/services');
var realestateRoutes = require('./routes/realestate')
// var aiChatBotRoutes = require('./routes/aiChatBot');
var customeAIRoutes = require('./routes/customeAI');
var sessionRoutes = require('./routes/session');
const swaggerConfig = require('./config/swagger');
const {User} = require('./models/user')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


var app = express();
connectDB();

// Middleware to authenticate and decode token
async function authentication(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing.' });
    }

    const token = authHeader.split(' ')[1]; // Extract token from Bearer token

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
      } else {
        // Attach decoded user information to the request object
        req.user = decoded;
        next();
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Internal server error during authentication.' });
  }
}

// Middleware để kiểm tra role
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).send('Forbidden');

    next();
  };
};


// Xử lý upload file cho OCR và object detection

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads',express.static('uploads'));
app.use(cors());
// Tăng giới hạn kích thước body lên 50MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Ensure UTF-8 encoding
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/webhook', webhookRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contacts', contactRouter);
app.use('/api/revenues', revenueRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/creators', creatorRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/audios', audioRoutes);
app.use('/api/real-estate', realestateRoutes);
app.use('/api/services',authentication, serviceRoutes);
// app.use('/api/ai', aiChatBotRoutes);
app.use('/api/customAI', customeAIRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api', fileRouter);

// Swagger setup
app.use('/api-docs', swaggerConfig.swaggerUi.serve, swaggerConfig.swaggerUi.setup(swaggerConfig.swaggerDocs));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
