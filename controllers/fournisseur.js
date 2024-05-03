const { ObjectId } = require("mongodb");
const { getFournisseurData, addNewFournisseur, removeFournisseur } = require("../models/fournisseur");

const getFournisseur = async (req, res) => {
    try {

        const response = await getFournisseurData();
        if (!response) {
            return res.status(500).json({ success: false, msg: "Failed to retrieve data" })
        }

        res.status(200).json({ success: true, msg: response })
    } catch (error) {
        console.error("Error retrieving files:", error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }

};
const addFournisseur = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name ) {
            return res.status(401).json({ success: false, msg: "all fields are required" });
        }

        const response = await addNewFournisseur(name);
        if (!response) {
            return res.status(500).json({ success: false, msg: "failed to add to db" });
        }
        return res.status(200).json({ success: true, msg: response });

    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ success: false, msg: "Error occurred" });
    }

};

const deleteFournisseur = async (req, res) => {
    const { fournisseurId } = req.params

    try {
        // Check if fournisseurId is a valfournisseurId ObjectId
        if (!ObjectId.isValid(fournisseurId)) {
            return res.status(400).json({ success: false, msg: "InvalfournisseurId  ID " });
        }

        const response = await removeFournisseur(fournisseurId);

        if (!response || response.nModified === 0) {
            return res.status(404).json({ success: false, msg: "File not deleted" });

        }
        return res.status(200).json({ success: true, msg: "File deleted successfully" });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }


};

module.exports = {
    getFournisseur,
    deleteFournisseur,
    addFournisseur,
}