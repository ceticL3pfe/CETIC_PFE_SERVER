const { Schema, model } = require("mongoose");

const clientSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        works:[{
            type:String
        }]
       
    },
    { timestamps: true }
);

const Client = model('client', clientSchema)




const getClientsData = async () => {
    try {
        const clients = await Client.find();

        if (!clients) {
            console.log("clients not found");
            return false;
        }

        return clients;
    } catch (error) {
        console.error("Error while retrieving clients from db:", error);
        return false;
    }
};



const addNewClient = async (name,works) => {
    if (!name) {
        return false
    }

    const newClient = new Client({
        name,
        works
        
     
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


const removeClient = async (clientId) => {

    const res = await Client.findByIdAndDelete(clientId)
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

const updateClientData = async (id, updateData) => {
    try {
        console.log(id,updateData)
        const updatedClient = await Client.findOneAndUpdate(
            { _id: id },
            updateData,
            { new: true } // Return the modified document
        );

        if (updatedClient) {
            console.log('Updated successfully:', updatedClient);
            return updatedClient;
        } else {
            console.log('No document updated');
            return null;
        }
    } catch (err) {
        console.error('Update failed:', err);
        return null;
    }
};


module.exports = {
    Client,
    removeClient,
    updateClientData,
    getClientsData, 
    addNewClient,
    
}


