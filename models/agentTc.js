const { Schema, model } = require("mongoose");
const AgentTcSchema = new Schema(
    {
        matricule: {
            type: String,
            ref: "compte",
            required: true
        },
      
        mission: [{
            type: Schema.Types.ObjectId,
            ref: "tenderNotice"
        }],
        
    },
    { timestamps: true }
);

const AgentTc = model('agentTc', AgentTcSchema)



module.exports = {
    AgentTc,

}


// module.exports = model("user", UserSchema);
