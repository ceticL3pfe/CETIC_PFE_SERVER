const router = require('express').Router();

const database = require('../config/db')
const { getCahierCharge,
    deleteCahierCharge,
    addCahierCharge,
    updateCahierCharge,
    getCahierCharges } = require('../controllers/cahierCharge')
const mongoose = require("mongoose");
const multer = require('multer');
const { userAuth, useProtect } = require('../utils/Auth');
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
        // .get('/', (req, res) => getCahierCharges(req, res, bucket))
        .get("/cdc-data/:id/:token", useProtect,(req, res) => getCahierCharge(req, res, bucket))
        .delete('/:documentId/:id', (req, res) => deleteCahierCharge(req, res, bucket))
        .post('/:tenderId', upload.single('file'), userAuth, (req, res) => addCahierCharge(req, res, bucket))
        // .put('/:id', (req, res) => updateCahierCharge(req, res, bucket))











})

module.exports = router;