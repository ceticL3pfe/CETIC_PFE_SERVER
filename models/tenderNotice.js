const { Schema, model } = require("mongoose");
const { addActivity } = require("./activity");

const TenderNoticeSchema = new Schema(
    {
        userId: {
            type: String,
            require: true
        },
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
            default: "validation de retrait de cdc",
            enum: ["Annuler", "Terminer",
                "validation de retrait de cdc",
                "analyse de la commission",
                "analyse de contolleur de gestion",
                "validation de directeur",]
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

        directeurResponse: {
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
        selectedFournisseur: {
            type: String,

        }



    },
    { timestamps: true }
);
const TenderNotice = model("tenderNotice", TenderNoticeSchema);






//intreractions with DB

const addNewTenderNotice = async ({username,source, object, userId, description = null,
    missionHead = null,  aoResponse = null, pvClient = null, cahierCharge = null,
    fournisseur_1 = null, prix_fournisseur_1 = null, durée_fournisseur_1 = null,
    fournisseur_2 = null, prix_fournisseur_2 = null, durée_fournisseur_2 = null,
    fournisseur_3 = null, prix_fournisseur_3 = null, durée_fournisseur_3 = null},
) => {
    if (!source || !object) {
        return false
    }
    console.log(fournisseur_1, prix_fournisseur_1, durée_fournisseur_1,
        fournisseur_2, prix_fournisseur_2, durée_fournisseur_2,
        fournisseur_3, prix_fournisseur_3, durée_fournisseur_3,)
    const newTenderNotice = new TenderNotice({
        userId,
        source,
        object,
        description,
        missionHead,
        aoResponse
        , pvClient,
        cahierCharge,
        fournisseur_1, prix_fournisseur_1, durée_fournisseur_1,
        fournisseur_2, prix_fournisseur_2, durée_fournisseur_2,
        fournisseur_3, prix_fournisseur_3, durée_fournisseur_3,
    })


    const res = await newTenderNotice.save().then(async(res) => {
        console.log("added successfully")
       await addActivity(username, `added a new Tender ${object} `)

        return res
    }).catch(err => {
        console.log("error while adding tender notice to db", err)
        return false
    })




    return res
}

const updateTenderNoticeData = async (tenderId, updateData,username) => {
    try {
        console.log("///////////",username)
        const updatedTender = await TenderNotice.findOneAndUpdate(
            { _id: tenderId },
            updateData,
            { new: true } // Return the modified document
        );

        if (updatedTender) {
            console.log('Updated successfully:', updatedTender);
            await addActivity(username, `Updated  Tender ${tenderId} `)

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

const removeTenderNotice = async (tenderId,username) => {
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

    await addActivity(username, `deleted a Tender ${tenderId} `)


    return res



}

const removeTenderNoticeFromArchive = async (tenderId,username) => {
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

    await addActivity(username, `deleted a Tender from archive ${tenderId} `)


    return res



}
const getTenderNoticeData = async () => {
    try {
        const tenders = await TenderNotice.find({ status: { $nin: ["Terminer", "Annuler"] } });
        return tenders;
    } catch (error) {
        console.error("Error retrieving tender notices:", error);
        return false;
    }
}
const getTenderNoticeDataArchive = async () => {
    try {
        const tenders = await TenderNotice.find({ status: { $in: ["Terminer", "Annuler"] } });
        return tenders;
    } catch (error) {
        console.error("Error retrieving cancelled or closed tender notices:", error);
        return false;
    }
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
    removeTenderNoticeFromArchive,
    addNewTenderNotice,
    removeTenderNotice,
    updateTenderNoticeData,
    getTenderNoticeData,
    getTenderNoticeDataArchive,
}
