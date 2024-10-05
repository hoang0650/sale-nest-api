var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const connectDB  = require('./config/config');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');
var orderRouter = require('./routes/order');
var contactRouter = require('./routes/contact');
var fileRouter = require('./routes/file');
var webhookRouter = require('./routes/webhook');
var reviewRoutes = require('./routes/review');
var revenueRoutes = require('./routes/revenue');
const swaggerConfig = require('./config/swagger');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { spawn } = require('child_process');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

var app = express();
connectDB();

//Middleware để xác thực token
function authentication(req,res,next){
  const token = req.header('Authorization')
  if(!token) return res.status(401).json({message:'Authorization'})
  jwt.verify(token, process.env.JWT_SECRET, (err,user)=>{
    if(err) return res.status(403).json({message:'Forbidden'})
    req.user = user
    next();
  })
}

// Middleware để kiểm tra role
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).send('Forbidden');

    next();
  };
};

// Khởi động Python API
const pythonProcess = spawn('python3', [path.join(__dirname, 'python_api', 'app.py')]);

pythonProcess.stdout.on('data', (data) => {
  console.log(`Python API: ${data}`);
});

pythonProcess.stderr.on('data', (data) => {
  console.error(`Python API Error: ${data}`);
});

// Proxy cho Python API
app.use('/api/ai/*', createProxyMiddleware({ 
  target: 'http://localhost:5000',
  changeOrigin: true,
}));

// Xử lý upload file cho OCR và object detection
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.json({ filename: req.file.filename });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/webhook', webhookRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contacts', contactRouter);
app.use('/api/revenues', revenueRoutes);
app.use('/api', fileRouter);
// Swagger setup
app.use('/api-docs', swaggerConfig.swaggerUi.serve, swaggerConfig.swaggerUi.setup(swaggerConfig.swaggerDocs));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
