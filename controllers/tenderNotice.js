const { ObjectId } = require("mongodb");
const { addNewTenderNotice, removeTenderNotice, updateTenderNoticeData, getTenderNoticeData } = require("../models/tenderNotice");







const addTenderNotice = async (req, res) => {
    try {
        const {userId, source, object, description, status, missionHead, fournisseur_1, prix_fournisseur_1, durée_fournisseur_1,
            fournisseur_2, prix_fournisseur_2, durée_fournisseur_2,
            fournisseur_3, prix_fournisseur_3, durée_fournisseur_3, } = req.body;

        if (!object || !source || !userId) {
            return res.status(401).json({ success: false, msg: "all fields are required" });
        }






        const response = await addNewTenderNotice(source, object,userId ,description, missionHead, status,
            fournisseur_1, prix_fournisseur_1, durée_fournisseur_1,
            fournisseur_2, prix_fournisseur_2, durée_fournisseur_2,
            fournisseur_3, prix_fournisseur_3, durée_fournisseur_3, 
        );
        if (!response) {
            return res.status(500).json({ success: false, msg: "failed to add to db" });
        }
        return res.status(200).json({ success: true, msg: response });

    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ success: false, msg: "Error occurred" });
    }
}

const deleteTenderNotice = async (req, res) => {
    const { id } = req.params; // Assuming the file ID is passed in the request parameters
    try {
        // Check if id is a valid ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, msg: "Invalid  ID " });
        }

        const response = await removeTenderNotice(id);

        if (!response || response.nModified === 0) {
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
    const { object, source, description, missionHead, status, aoResponse, pvClient, cahierCharge, commissionComments, controlleurDeGestionComments, controlleurDeGestionResponse, commissionResponse, directeurResponse, fournisseur_1, prix_fournisseur_1, durée_fournisseur_1,
        fournisseur_2, prix_fournisseur_2, durée_fournisseur_2,
        fournisseur_3, prix_fournisseur_3, durée_fournisseur_3 } = req.body;
    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, msg: "Invalid file ID" });
        }


        const updateObject = {};

        if (object) {
            updateObject["object"] = object;
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
        if (cahierCharge) {
            updateObject["cahierCharge"] = cahierCharge;
        }
        if (pvClient) {
            updateObject["pvClient"] = pvClient;
        }
        if (aoResponse) {
            updateObject["aoResponse"] = aoResponse;
        }
        if (controlleurDeGestionComments) {
            updateObject["controlleurDeGestionComments"] = controlleurDeGestionComments;
        }

        if (commissionComments) {
            updateObject["commissionComments"] = commissionComments;
        }

        if (controlleurDeGestionResponse) {
            updateObject["controlleurDeGestionResponse"] = controlleurDeGestionResponse;
        }
        if (commissionResponse) {
            updateObject["commissionResponse"] = commissionResponse;
        }
        if (directeurResponse) {
            updateObject["directeurResponse"] = directeurResponse;
        }
        if (durée_fournisseur_2) {
            updateObject["durée_fournisseur_2"] = durée_fournisseur_2;
        }
        if (prix_fournisseur_2) {
            updateObject["prix_fournisseur_2"] = prix_fournisseur_2;
        }
        if (fournisseur_2) {
            updateObject["fournisseur_2"] = fournisseur_2;
        }
        if (durée_fournisseur_1) {
            updateObject["durée_fournisseur_1"] = durée_fournisseur_1;
        }
        if (prix_fournisseur_1) {
            updateObject["prix_fournisseur_1"] = prix_fournisseur_1;
        }
        if (fournisseur_1) {
            updateObject["fournisseur_1"] = fournisseur_1;
        }
        if (durée_fournisseur_3) {
            updateObject["durée_fournisseur_3"] = durée_fournisseur_3;
        }
        if (prix_fournisseur_3) {
            updateObject["prix_fournisseur_3"] = prix_fournisseur_3;
        }
        if (fournisseur_3) {
            updateObject["fournisseur_3"] = fournisseur_3;
        }

        if (!object && !source && !description && !missionHead
            && !status && !cahierCharge && !pvClient && !aoResponse
            && !commissionComments && !controlleurDeGestionComments && !controlleurDeGestionResponse
            && !commissionResponse && !directeurResponse && !prix_fournisseur_3
            && !durée_fournisseur_3 && !fournisseur_3 && !prix_fournisseur_2
            && !durée_fournisseur_2 && !fournisseur_2 && !prix_fournisseur_1
            && !durée_fournisseur_1 && !fournisseur_1


        
        
        
        ) {
            console.log(req.body)

            return res.status(400).json({ success: false, msg: "required fields" });

        }

        // Update the metadata of the file
        const result = await updateTenderNoticeData(id, updateObject)

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


const getTenderNotices = async (req, res) => {
    try {

        const response = await getTenderNoticeData();
        if (!response) {
            return res.status(500).json({ success: false, msg: "Failed to retrieve data" })
        }

        res.status(200).json({ success: true, msg: response })




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