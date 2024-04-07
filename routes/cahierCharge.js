const router = require('express').Router();

const database = require('../config/db')
const { getCahierCharge,
    deleteCahierCharge,
    addCahierCharge,
    updateCahierCharge,
    getCahierCharges } = require('../controllers/cahierCharge')
const mongoose = require("mongoose");
const multer = require('multer')
let bucket
mongoose.connection.on("open", () => {
    bucket = database.bucket;


    const storage = multer.diskStorage({

        filename: function (req, file, cb) {
            cb(null, file.originalname); // Use the original file name for the uploaded file
        }
    });

    // Initialize multer with the storage options
    const upload = multer({ storage: storage });





    router
        .get('/', (req, res) => getCahierCharges(req, res, bucket))
        .get("/cahier-charge-data/:id", (req, res) => getCahierCharge(req, res, bucket))
        .delete('/:id/:documentId', (req, res) => deleteCahierCharge(req, res, bucket))
        .post('/upload', upload.single('file'), (req, res) => addCahierCharge(req, res, bucket))
        .put('/:id', (req, res) => updateCahierCharge(req, res, bucket))











})

module.exports = router;