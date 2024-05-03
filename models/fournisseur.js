const { Schema, model } = require("mongoose");

const fournisseurSchema = new Schema(
    {
        name: {
            type: String,
            required: false
        },
       

    },
    { timestamps: true }
);

const Fournisseur = model('fournisseur', fournisseurSchema)




const getFournisseurData = async () => {
    try {
        const clients = await Fournisseur.find();

        if (!clients) {
            console.log("Fournisseur not found");
            return false;
        }

        return clients;
    } catch (error) {
        console.error("Error while retrieving Fournisseur from db:", error);
        return false;
    }
};



const addNewFournisseur = async (name) => {
    if (!name) {
        return false
    }
    const newClient = new Fournisseur({
        name,

    })
    const res = await newClient.save().then((res) => {
        console.log("added successfully")
        return res
    }).catch(err => {
        console.log("error while adding client to db", err)
        return false
    })
    return res
}


const removeFournisseur = async (fournisseurId) => {

    const res = await Fournisseur.findByIdAndDelete(fournisseurId)
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



module.exports = {
    Fournisseur,
    getFournisseurData,
    addNewFournisseur,
    removeFournisseur,

}


