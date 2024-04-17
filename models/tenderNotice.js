const { Schema, model } = require("mongoose");

const TenderNoticeSchema = new Schema(
    {

        source: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        missionHead:{
            type:String
        },
        status:{
            type: String,
            default: "Pending",
            enum: ["Pending", "Open", "Closed", "Cancelled"] 
        }
     
    },
    { timestamps: true }
);
const TenderNotice = model("tenderNotice", TenderNoticeSchema);






//intreractions with DB

const addNewTenderNotice = async (source, title, description=null,missionHead=null,status=null) => {
    if (!source || !title) {
        return false
    }

    const newTenderNotice = new TenderNotice({
        source,
        title,
        description,
        missionHead,
        status
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

const getTenderNoticeData = async() => {
 const res =   await TenderNotice.find()
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


        if(res){
          return res;
        }
        return false



}


const serializeTenderNotice = (data) => {
    return {
        source:data.source,
        title:data.title,
        description:(data.description) ?? "EMPTY"
    }
}







module.exports = {
    TenderNotice,
    addNewTenderNotice,
    removeTenderNotice,
    updateTenderNoticeData,
    getTenderNoticeData
}
