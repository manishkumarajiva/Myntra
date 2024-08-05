const multer = require('multer');
const path = require('path');


// Upload Images Middleware Function

const fileFilter = async (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        callback(null, true);
    } else {
        let error = new Error('Invalid File Type : only jpeg allow 🟥 ');
        error.code = 'LIMIT_UNEXPECTED_FILE';
        callback(null, false)
    }
};


// First
const Uploader = (dir) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./uploads/${dir}/`);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9) + "-";
            cb(null, uniqueSuffix + `${file.originalname}`);
        },
    });
    const upload = multer({ storage: storage, fileFilter : fileFilter });
    return upload.single('file');
};


// -------------------------------//
//Second
const MultiUploader = (dir) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./uploads/${dir}/`);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9) + "-";
            cb(null, uniqueSuffix + `${file.originalname}`);
        },
    });
    const upload = multer({ storage: storage });
    return upload.array("file", 4);
};


// ------------------------------ //
// Third
const ProductUploader = (req, res) => {
    return new Promise((resolve, reject) => {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, "./uploads/products/");
            },
            filename: function (req, file, cb) {
                const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9) + "-";
                cb(null, uniqueSuffix + `${file.originalname}`);
            },
        });
        const upload = multer({ storage: storage });
        resolve(upload.single('file'));
    })
};


// --------------------------------- //
//Fourth
const productStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/product/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9) + "-";
        cb(null, uniqueSuffix + `${file.originalname}`);
    },
});

const logoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/logo/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9) + "-";
        cb(null, uniqueSuffix + `${file.originalname}`);
    },
});

const uploader = multer();
const cpUploader = uploader.fields([
    { name: "file", maxCount: 4, storage: productStorage },
    { name: "brandLogo", maxCount: 1, storage: logoStorage }
]);




// Fifth fail
// --------------------------------//
const MulterUploader = (req, res) => {
    return new Promise((resolve, reject) => {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                if (file.fieldname === 'file') {
                    cb(null, path.join(__dirname, '../uploads/products/'), function (error, success) { })
                } else {
                    cb(null, path.join(__dirname, '../uploads/logo/'))
                }
            },
            filename: function (req, file, cb) {
                const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9) + "-";
                cb(null, uniqueSuffix + `${file.originalname}`);
            },
        });

        const upload = multer({ storage: storage }).fields([
            { name: "file", maxCount: 4 },
            { name: "brandLogo", maxCount: 1 }
        ]);
        resolve(upload);
    })
};



// Sixth pass
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'file') {
            cb(null, path.join(__dirname, '../uploads/products/'))
        } else {
            cb(null, path.join(__dirname, '../uploads/logo/'))
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9) + "-";
        cb(null, uniqueSuffix + `${file.originalname}`);
    }
});



const upload = multer({
    storage: storage,
    fileFilter: fileFilter
}).fields([{ name: "file", maxCount: 4 }, { name: "brandLogo", maxCount: 1 }]);

module.exports = { Uploader, MultiUploader, ProductUploader, cpUploader, MulterUploader, upload };



// limits: {
//     fieldNameSize: 255,
//     fileSize: 500000,
//     files: 1,
//     fields: 1
//   }



// Resizing an image is typically 4x-5x faster than using ?? 
// Sharp npm is faster as compare to below modules
// The quickest ---------- ImageMagick 
// And  ------  GraphicsMagick ------- settings due to its use of -------- libvips
// multipurpose internet mail extension
// TLS Transport layer security
// SSL secure shocket layer

// International Color Consortium ICC Profile
// tb * gb * mb * kb ==> like 1 * 1024 * 1024 ==> 1 MB
// 2 * 1024 * 1024 ==> 2 MB
// 5 * 1024 * 1024 * 1024 ==> 5 GB




