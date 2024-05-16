const { ObjectId } = require("mongodb");
const { addNewAoReponse, removeAoReponse, updateAoReponseData, getAoReponseData, AoReponse } = require("../models/aoReponse");
const fileSystem = require('fs');
const { updateTenderNoticeData } = require("../models/tenderNotice");








const addAoReponse = async (req, res, bucket) => {
    try {
        console.log(req.file)
        const file = req.file;
        const tenderId = req.params.tenderId
        const {username} = req.body
        console.log(".///.",username,req.body)

        if (!file || !tenderId) {
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
            const response = await updateTenderNoticeData(tenderId, { aoResponse: fileId },username);
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

const deleteAoReponse = async (req, res, bucket) => {
    const { id, documentId } = req.params; // Assuming the file ID is passed in the request parameters
    const { username }=  req.body
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


        const response = await updateTenderNoticeData(documentId, { aoResponse: null },username);
console.log(response)
        if (!response || !response.isModified) {
            return res.status(404).json({ success: false, msg: "File not deleted" });

        }
        return res.status(200).json({ success: true, msg: "File deleted successfully" });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};
const updateAoReponse = async (req, res, bucket) => {
    const { id } = req.params;
    const { title } = req.body;

    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, msg: "Invalid file ID" });
        }


        const updateObject = {};
        if (title) {
            updateObject["title"] = title;
        }
        else {
            return res.status(400).json({ success: false, msg: "required fields" });

        }

        // Update the metadata of the file
        const result = await updateAoReponseData(id, updateObject)

        console.log(result)

        if (result?.nModified === 1) {
            return res.status(200).json({ success: true, msg: "Metadata updated successfully" });
        } else {
            return res.status(500).json({ success: false, msg: "Failed to update metadata" });
        }
    } catch (error) {
        console.error("Error updating metadata:", error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};


const getAoReponses = async (req, res) => {
    try {

        const response = await getAoReponseData();
        if (!response) {
            return res.status(500).json({ success: false, msg: "Failed to retrieve data" })
        }

        res.status(200).json({ success: true, msg: response })




    } catch (error) {
        console.error("Error retrieving files:", error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};
const getAoReponse = async (req, res, bucket) => {
    try {
        const fileId = req.params.id;

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
module.exports = {
    addAoReponse,
    deleteAoReponse,
    updateAoReponse,
    getAoReponse,
    getAoReponses

}