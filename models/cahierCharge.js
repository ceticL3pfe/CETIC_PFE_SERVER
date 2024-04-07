const { Schema, model } = require("mongoose");

const cahierChargeSchema = new Schema(
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
const CahierCharge = model("cahierCharge", cahierChargeSchema);


//intreractions with DB

const addNewCahierCharge = async (title, fileId) => {
    if (!fileId || !title) {
        return false
    }

    const newCahierCharge = new CahierCharge({
        fileId,
        title,
    })


    const res = await newCahierCharge.save().then(() => {
        console.log("added successfully")
        return true
    }).catch(err => {
        console.log("error while adding newCahierCharge  to db", err)
        return false
    })

    return res
}
const updateCahierChargeData = async (id, updateData) => {

    const res = await CahierCharge.updateOne({_id:id}, updateData).then(res => {
        if (res) {
            console.log('updated successfully',res)
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
const removeCahierCharge = async (id) => {
    const res = await CahierCharge.findByIdAndDelete(id)
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

const getCahierChargeData = async () => {
    const res = await CahierCharge.find()
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


const serializeCahierCharge = (data) => {
    return {
        title: data.title,
        fileData: data.fileData,
    }
}







module.exports = {
    CahierCharge,
    addNewCahierCharge,
    removeCahierCharge,
    updateCahierChargeData,
    getCahierChargeData
}
