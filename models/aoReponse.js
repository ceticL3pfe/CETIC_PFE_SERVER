const { Schema, model } = require("mongoose");

const aoReponseSchema = new Schema(
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
const AoReponse = model("aoReponse", aoReponseSchema);


//intreractions with DB

const addNewAoReponse = async (title, fileId) => {
    if (!fileId || !title) {
        return false
    }

    const newAoReponse = new AoReponse({
        fileId,
        title,
    })


    const res = await newAoReponse.save().then(() => {
        console.log("added successfully")
        return true
    }).catch(err => {
        console.log("error while adding newaoReponse  to db", err)
        return false
    })

    return res
}
const updateAoReponseData = async (id, updateData) => {

    const res = await AoReponse.updateOne({ _id: id }, updateData).then(res => {
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
const removeAoReponse = async (id) => {
    const res = await AoReponse.findByIdAndDelete(id)
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

const getAoReponseData = async () => {
    const res = await AoReponse.find()
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
    AoReponse,
    addNewAoReponse,
    removeAoReponse,
    updateAoReponseData,
    getAoReponseData
}
