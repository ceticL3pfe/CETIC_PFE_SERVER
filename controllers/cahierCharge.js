const { ObjectId } = require("mongodb");
const { addNewCahierCharge, removeCahierCharge, updateCahierChargeData, getCahierChargeData } = require("../models/CahierCharge");
const fileSystem = require('fs')







const addCahierCharge = async (req, res, bucket) => {
    try {
        const file = req.file;
        const { name, description, deadLine, client } = req.body;

        if (!file || !name || !description || !deadLine || !client) {
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
            const response = await addNewCahierCharge(name, description, deadLine, client, fileId);
            if (!response) {
                return res.status(500).json({ success: false, msg: "failed to add to db" });
            }
            return res.status(200).json({ success: true, msg: "tender notice added successfully" });
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

    try {
        // Check if id is a valid ObjectId
        if (!ObjectId.isValid(id) || !ObjectId.isValid(documentId)) {
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


        const response = await removeCahierCharge(documentId);

        if (!response || response.nModified === 0) {
            return res.status(404).json({ success: false, msg: "File not deleted" });

        }
        return res.status(200).json({ success: true, msg: "File deleted successfully" });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};
const updateCahierCharge = async (req, res, bucket) => {
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
        const result = await updateCahierChargeData(id, updateObject)

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


const getCahierCharges = async (req, res) => {
    try {

        const response = await getCahierChargeData();
        if (!response) {
            return res.status(500).json({ success: false, msg: "Failed to retrieve data" })
        }

        res.status(200).json({ success: true, msg: response })




    } catch (error) {
        console.error("Error retrieving files:", error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};
const getCahierCharge = async (req, res, bucket) => {
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
    addCahierCharge,
    deleteCahierCharge,
    updateCahierCharge,
    getCahierCharge,
    getCahierCharges

}