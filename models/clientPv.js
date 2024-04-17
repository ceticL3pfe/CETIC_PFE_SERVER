const { Schema, model } = require("mongoose");

const clientPvSchema = new Schema(
    {

        fileId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },

    },
    { timestamps: true }
);
const ClientPv = model("clientPv", clientPvSchema);


//intreractions with DB

const addNewClientPv = async (title, fileId) => {
    if (!fileId || !title) {
        return false
    }

    const newClientPv = new ClientPv({
        fileId,
        title,
    })


    const res = await newClientPv.save().then(() => {
        console.log("added successfully")
        return true
    }).catch(err => {
        console.log("error while adding newClientPv  to db", err)
        return false
    })

    return res
}
const updateClientPvData = async (id, updateData) => {

    const res = await ClientPv.updateOne({ _id: id }, updateData).then(res => {
        if (res) {
            console.log('updated successfully', res)
            return res
        } else {
            console.log('update failed')

            return false
        }
    }).catch(err => {
        console.log('update failed', err)
        return false
    })
    return res
}
const removeClientPv = async (id) => {
    const res = await ClientPv.findByIdAndDelete(id)
        .then(deletedDocument => {
            if (deletedDocument) {
                // Document was found and deleted successfully
                console.log("Document deleted:", deletedDocument);
                return true
            } else {
                // Document with the specified ID was not found
                console.log("Document not found or not deleted");
                return false

            }
        })
        .catch(error => {
            // Error occurred while deleting the document
            console.error("Error deleting document:", error);
            return false

        });

    return res



}

const getClientPvData = async () => {
    const res = await ClientPv.find()
        .then(res => {
            if (res) {
                return res
            } else {
                // Document with the specified ID was not found
                console.log("Document not found");
                return false

            }
        })
        .catch(error => {
            // Error occurred while deleting the document
            console.error("Error retrieving document:", error);
            return false

        });


    if (res) {
        return res
    }
    return false



}









module.exports = {
    ClientPv,
    addNewClientPv,
    removeClientPv,
    updateClientPvData,
    getClientPvData
}
