const { ObjectId } = require("mongodb");
const { getClientsData, removeClient, updateClientData, addNewClient } = require("../models/client");

const getClients = async (req, res) => {
    try {

        const response = await getClientsData();
        if (!response) {
            return res.status(500).json({ success: false, msg: "Failed to retrieve data" })
        }

        res.status(200).json({ success: true, msg: response })
    } catch (error) {
        console.error("Error retrieving files:", error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }

};
const addClient = async (req, res) => {
    try {
        const { name, works } = req.body;

        if (!name || !works) {
            return res.status(401).json({ success: false, msg: "all fields are required" });
        }

        const response = await addNewClient(name,works);
        if (!response) {
            return res.status(500).json({ success: false, msg: "failed to add to db" });
        }
        return res.status(200).json({ success: true, msg: response });

    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ success: false, msg: "Error occurred" });
    }

};

const deleteClient = async (req, res) => {
    const { clientId } = req.params

    try {
        // Check if clientId is a valclientId ObjectId
        if (!ObjectId.isValid(clientId)) {
            return res.status(400).json({ success: false, msg: "InvalclientId  ID " });
        }

        const response = await removeClient(clientId);

        if (!response || response.nModified === 0) {
            return res.status(404).json({ success: false, msg: "File not deleted" });

        }
        return res.status(200).json({ success: true, msg: "File deleted successfully" });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }


};
const updateClient = async (req, res) => {
    const { id } = req.params;
    const { name, works } = req.body;

    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, msg: "Invalid file ID" });
        }


        const updateObject = {};

        if (name) {
            updateObject["name"] = name;
        }
        if (works) {
            updateObject["works"] = works;
        }


        if (!works && !name) {

            return res.status(400).json({ success: false, msg: "required fields" });

        }
        console.log(id, updateObject)
        // Update the metadata of the file
        const result = await updateClientData(id, updateObject)

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


module.exports = {
    getClients,
    updateClient,
    deleteClient,
    addClient
}