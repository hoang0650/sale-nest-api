const path = require('path')
const multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/uploads')
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname)
        cb(null, Date.now(), ext)
    }
})

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg") {
            cb(null,true)
        }else {
            console.log('only jpg & png file supported!');
            cb(null,false)
        }
    },
    limits:{
        fieldSize: 1024*1024*2
    }
})

module.exports = upload