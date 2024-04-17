const { ObjectId } = require("mongodb");
const { addNewTenderNotice, removeTenderNotice, updateTenderNoticeData, getTenderNoticeData } = require("../models/tenderNotice");







const addTenderNotice = async (req, res) => {
    try {
        const { source, title,description,status,missionHead } = req.body;

        if (!title || !source) {
            return res.status(401).json({ success: false, msg: "all fields are required" });
        }


    

     

            const response = await addNewTenderNotice(source, title,description,missionHead,status);
            if (!response) {
                return res.status(500).json({ success: false, msg: "failed to add to db" });
            }
            return res.status(200).json({ success: true, msg: response});

    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ success: false, msg: "Error occurred" });
    }
}

const deleteTenderNotice = async (req, res) => {
    const { id } = req.params; // Assuming the file ID is passed in the request parameters
    try {
        // Check if id is a valid ObjectId
        if ( !ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, msg: "Invalid  ID " });
        }

       const response =  await removeTenderNotice(id);

       if(!response || response.nModified===0){
           return res.status(404).json({ success: false, msg: "File not deleted" });

       }
        return res.status(200).json({ success: true, msg: "File deleted successfully" });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};
const updateTenderNotice = async (req, res) => {
    const { id } = req.params;
    const { title, source,description,missionHead,status } = req.body; 
    console.log(id, title, source)
    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, msg: "Invalid file ID" });
        }

       
        const updateObject = {};

        if (title) {
            updateObject["title"] = title;
        }
        if (source) {
            updateObject["source"] = source;
        }
        if (description) {
            updateObject["description"] = description;
        }
        if (missionHead) {
            updateObject["missionHead"] = missionHead;
        }
        if (status) {
            updateObject["status"] = status;
        }
        
        if (!title&& !source&&!description&&!missionHead&&!status){
            return res.status(400).json({ success: false, msg: "required fields" });

        }

        // Update the metadata of the file
        const result = await updateTenderNoticeData(id,updateObject)   
        
        console.log(result)
    
        if (result) {
            return res.status(200).json({ success: true, msg: result });
        } else {
            return res.status(500).json({ success: false, msg: "Failed to update metadata" });
        }
    } catch (error) {
        console.error("Error updating metadata:", error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};


const getTenderNotices = async (req, res ) => {
    try {
       
       const response = await getTenderNoticeData();
       if(!response){
        return res.status(500).json({success:false,msg:"Failed to retrieve data"})
       }

       res.status(200).json({success:true,msg:response})

       


    } catch (error) {
        console.error("Error retrieving files:", error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};

module.exports = {
    addTenderNotice,
    deleteTenderNotice,
    updateTenderNotice,
    getTenderNotices

}