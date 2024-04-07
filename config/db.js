
const mongoose = require('mongoose');
require('dotenv').config();
const { DB } = require("./index");
const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient
const ObjectId = mongodb.ObjectId

// Function to connect to the database
const connectToDatabase = async() => {
    mongoose.connect(DB,{dbName:"pfe"})
    // mongoose.connect(DB);



    const conn = mongoose.connection;

    // Event listener for connection errors
    conn.on('error', function (error) {
        console.error('MongoDB connection error:', error.message);
        // Attempt to restart the process
        console.log('restarting the server')
        startServer();
    });
    //creating bucket
  

    // Event listener for when the connection is closed
    mongoose.connection.on('disconnected', function () {
        console.log('MongoDB connection disconnected');
    });

    // Event listener for handling SIGINT (Ctrl+C) to close the connection
    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log('MongoDB connection disconnected through app termination');
            process.exit(0);
        });
    });
};

// Function to start the server

const startServer = () => {
    try {
        // Add a generic error handler for uncaught exceptions
        process.on('uncaughtException', (error) => {
            console.error('Uncaught Exception:', error.message);
            // Attempt to restart the process
            startServer();
        });

        // Connect to the database
        connectToDatabase();
        mongoose.connection.on("connected", () => {
            var db = mongoose.connections[0].db;
          var  bucket = new mongoose.mongo.GridFSBucket(db);
            // console.log(bucket);
            bucket.openDownloadStream
            exports.bucket = bucket;

        });

    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
};

// Start the server
startServer();


