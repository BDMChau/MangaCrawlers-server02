const multer = require('multer');
const path = require('path');

const removeAccents = (str) => {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname));
    },
    filename: (req, file, cb) => {
        let fileName = removeAccents(file.originalname); // remove accents if string is vietnamese
        cb(null, fileName);
    }
    
})

const upload = multer({ 
    storage: storage
 });

module.exports = upload;