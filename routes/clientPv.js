const router = require('express').Router();

const database = require('../config/db')
const { getClientPv,
    deleteClientPv,
    addClientPv,
    updateClientPv,
    getClientPvs } = require('../controllers/clientPv')
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
        // .get('/', (req, res) => getClientPvs(req, res, bucket))
        .get("/client-pv-data/:id/:token", useProtect,(req, res) => getClientPv(req, res, bucket))
        .delete('/:documentId/:id', (req, res) => deleteClientPv(req, res, bucket))
        .post('/:tenderId', upload.single('file'), (req, res) => addClientPv(req, res, bucket))
        // .put('/:id', (req, res) => updateClientPv(req, res, bucket))











})

module.exports = router;