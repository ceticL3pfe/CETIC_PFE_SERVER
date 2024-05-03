const { Schema, model } = require("mongoose");

const TenderNoticeSchema = new Schema(
    {

        source: {
            type: String,
            required: true
        },
        object: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        missionHead: {
            type: String
        },
        status: {
            type: String,
            default: "Pending",
            enum: ["Pending", "analyse de la commission", "validation retrait cdc",
                "validation dossier de reponse", "Open", "Closed", "Cancelled"]
        },
        aoResponse: {
            type: String,

        },
        cahierCharge: {
            type: String
        },
        pvClient: {
            type: String,
        },
        commissionComments: [{
            type: String,
        }],
        controlleurDeGestionComments: [{
            type: String,
        }],
        directeurComments: [{
            type: String,
        }],
        commissionResponse: {
            type: String
        },
        controlleurDeGestionResponse: {
            type: String
        },
        fournisseur_1: {
            type: String
        },

        prix_fournisseur_1: {
            type: Number
        },
        durée_fournisseur_1: {
            type: Number
        },

        fournisseur_2: {
            type: String
        },

        prix_fournisseur_2: {
            type: Number
        },
        durée_fournisseur_2: {
            type: Number
        },
        
        fournisseur_3: {
            type: String
        },

        prix_fournisseur_3: {
            type: Number
        },
        durée_fournisseur_3: {
            type: Number
        },



    },
    { timestamps: true }
);
const TenderNotice = model("tenderNotice", TenderNoticeSchema);






//intreractions with DB

const addNewTenderNotice = async (source, object, description = null,
    missionHead = null, status = null, aoResponse = null, pvClient = null, cahierCharge = null,
    fournisseur_1 = null, prix_fournisseur_1 = null, durée_fournisseur_1 = null,
    fournisseur_2 = null, prix_fournisseur_2 = null, durée_fournisseur_2 = null,
    fournisseur_3 = null, prix_fournisseur_3 = null, durée_fournisseur_3 = null,
) => {
    if (!source || !object) {
        return false
    }

    const newTenderNotice = new TenderNotice({
        source,
        object,
        description,
        missionHead,
        status,
        aoResponse
        , pvClient,
        cahierCharge,
        fournisseur_1, prix_fournisseur_1, durée_fournisseur_1,
        fournisseur_2, prix_fournisseur_2, durée_fournisseur_2,
        fournisseur_3, prix_fournisseur_3, durée_fournisseur_3,
    })


    const res = await newTenderNotice.save().then((res) => {
        console.log("added successfully")
        return res
    }).catch(err => {
        console.log("error while adding tender notice to db", err)
        return false
    })

    return res
}

const updateTenderNoticeData = async (tenderId, updateData) => {
    try {
        const updatedTender = await TenderNotice.findOneAndUpdate(
            { _id: tenderId },
            updateData,
            { new: true } // Return the modified document
        );

        if (updatedTender) {
            console.log('Updated successfully:', updatedTender);
            return updatedTender;
        } else {
            console.log('No document updated');
            return null;
        }
    } catch (err) {
        console.error('Update failed:', err);
        return null;
    }
};

const removeTenderNotice = async (tenderId) => {
    console.log("asdasdasdas")

    const res = await TenderNotice.findByIdAndDelete(tenderId)
        .then(deletedDocument => {
            if (deletedDocument) {
                // Document was found and deleted successfully
                return deletedDocument
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

const getTenderNoticeData = async () => {
    const res = await TenderNotice.find()
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
            console.error("Error deleting document:", error);
            return false

        });


    if (res) {
        return res;
    }
    return false



}

const getTenderNoticeArchive = async () => {
    const res = await TenderNotice.find({
        status: { $nin: ["Cancelled", "Closed"] }
    })
        .then(res => {
            if (res) {
                return res;
            } else {
                console.log("Document not found");
                return false;
            }
        })
        .catch(error => {
            console.error("Error retrieving tender notices:", error);
            return false;
        });

    if (res) {
        return res;
    }
    return false;
}


const serializeTenderNotice = (data) => {
    return {
        source: data.source,
        title: data.title,
        description: (data.description) ?? "EMPTY"
    }
}







module.exports = {
    TenderNotice,
    addNewTenderNotice,
    removeTenderNotice,
    updateTenderNoticeData,
    getTenderNoticeData,
    getTenderNoticeArchive,
}
