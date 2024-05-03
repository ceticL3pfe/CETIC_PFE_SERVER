const router = require('express').Router();

const database = require('../config/db')
const { getAoReponse,
    deleteAoReponse,
    addAoReponse,
    updateAoReponse,
    getAoReponses } = require('../controllers/aoReponse')
const mongoose = require("mongoose");
const multer = require('multer');
const { useProtect } = require('../utils/Auth');
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
        // .get('/', (req, res) => getAoReponses(req, res, bucket))
        .get("/ao-response-data/:id/:token", useProtect, (req, res) => getAoReponse(req, res, bucket))
        .delete('/:documentId/:id', (req, res) => deleteAoReponse(req, res, bucket))
        .post('/:tenderId', upload.single('file'), (req, res) => addAoReponse(req, res, bucket))
        // .put('/:id', (req, res) => updateAoReponse(req, res, bucket))











})

module.exports = router;