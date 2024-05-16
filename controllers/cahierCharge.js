const { ObjectId } = require("mongodb");
const { addNewCahierCharge, removeCahierCharge, updateCahierChargeData, getCahierChargeData } = require("../models/CahierCharge");
const fileSystem = require('fs')

const pdf2base64 = require('pdf-to-base64');
const { updateTenderNoticeData } = require("../models/tenderNotice");






const addCahierCharge = async (req, res, bucket) => {
    try {
        console.log(req.file)
        const file = req.file;
        const tenderId = req.params.tenderId
        const {username} = req.body
        console.log(".///.", username, req.body)

        if (!file || !tenderId ) {
            console.log(req.body)
            return res.status(401).json({ success: false, msg: "all fields are required" });
        }

        const filePath = new Date().getTime() + "-" + file.originalname;

        if (!bucket) {
            return res.status(500).json({ success: false, msg: "bucket is not initialized" });
        }

        const uploadStream = bucket.openUploadStream(filePath, {
            chunkSizeBytes: 1048576,
            metadata: {
                name: file.originalname,
                size: file.size,
                type: file.mimetype,

            }
        });

        uploadStream.on("finish", async () => {
            console.log("Upload finished!!!");

            // Assuming you're using AWS SDK to interact with S3
            const fileId = uploadStream.id; // This line may vary depending on your storage service
            console.log("fileID", uploadStream.id, fileId)
            const response = await updateTenderNoticeData(tenderId, {cahierCharge:fileId},username);
            if (!response) {
                return res.status(500).json({ success: false, msg: "failed to add to db" });
            }
            return res.status(200).json({ success: true, msg: response });
        });

        // This line reads the file and pipes it to the upload stream
        fileSystem.createReadStream(file.path).pipe(uploadStream);
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ success: false, msg: "Error occurred" });
    }
}

const deleteCahierCharge = async (req, res, bucket) => {
    const { id, documentId } = req.params; // Assuming the file ID is passed in the request parameters
const{username} = req.body
    console.log(".///.", username, req.body)

    try {
        // Check if id is a valid ObjectId
        if (!ObjectId.isValid(id) || !ObjectId.isValid(documentId)) {
            console.log(req.params)
            return res.status(400).json({ success: false, msg: "Invalid file ID or documentId" });
        }

        // Find the file by its ID
        const file = await bucket.find({ _id: new ObjectId(id) }).next();

        // Check if the file exists
        if (!file) {
            return res.status(404).json({ success: false, msg: "File not found" });
        }

        // Delete the file from the GridFS bucket
        await bucket.delete(new ObjectId(id));


        const response = await updateTenderNoticeData(documentId,{cahierCharge:null},username);

        if (!response || !response.isModified) {
            return res.status(404).json({ success: false, msg: "File not deleted" });

        }
        return res.status(200).json({ success: true, msg: "File deleted successfully" });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};

const getCahierCharge = async (req, res, bucket) => {
    try {
        const fileId = req.params.id;
        console.log(req.user, req)
        if (!ObjectId.isValid(fileId)) {
            return res.status(400).json({ success: false, msg: "Invalid file ID" });
        }

        const file = await bucket.find({ _id: new ObjectId(fileId) }).next();

        if (!file) {
            return res.status(404).json({ success: false, msg: "File not found" });
        }

        const downloadStream = bucket.openDownloadStream(file._id);
        downloadStream.pipe(res);
    } catch (error) {
        console.error("Error retrieving file:", error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};


// const getCahierCharge = async (req, res, bucket) => {
//     try {
//         const fileId = req.params.id;

//         if (!ObjectId.isValid(fileId)) {
//             return res.status(400).json({ success: false, msg: "Invalid file ID" });
//         }

//         const file = await bucket.find({ _id: new ObjectId(fileId) }).next();

//         if (!file) {
//             return res.status(404).json({ success: false, msg: "File not found" });
//         }

//         // Read the file data
//         const downloadStream = bucket.openDownloadStream(file._id);
//         let fileData = '';
//         function pdfDataToBase64(pdfData) {
//             try {
//                 if (!pdfData || typeof pdfData !== 'string' && !(pdfData instanceof Buffer)) {
//                     throw new Error('Invalid PDF data: Must be a string or Buffer');
//                 }

//                 const base64String = Buffer.from(pdfData).toString('base64');
//                 return `data:application/pdf;base64,${base64String}`;
//             } catch (error) {
//                 console.error('Error converting PDF data to base64:', error);
//                 throw error; // Re-throw for proper handling
//             }
//         }


//         downloadStream.on('data',async (chunk) => {
//             fileData += chunk

//             // fileData += chunk.toString('base64');
//         });

//         downloadStream.on('end', () => {
//             // Send the file data in JSON format
//             const response = pdfDataToBase64(fileData)
//             res.status(200).json({ status: 200, msg: response });
//         });

//     } catch (error) {
//         console.error("Error retrieving file:", error);
//         res.status(500).json({ success: false, msg: "Internal server error" });
//     }
// };
module.exports = {
    addCahierCharge,
    deleteCahierCharge,
    getCahierCharge,

}