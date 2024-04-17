const { Schema, model } = require("mongoose");
const { AgentTc } = require("./agentTc");
const DirecteurSchema = new Schema(
    {
        matricule: {
            type: String,
            ref: "compte",
            required: true
        },


    },
    { timestamps: true }
);

const Directeur = model('directeur', DirecteurSchema)

const addMission = async (userId, missionId) => {
    try {
        const user = await AgentTc.findOne({matricule:userId});
        if (!user) {
            console.log("User not found");
            return false;
        }

        if (!user.mission.includes(missionId)) {
            user.mission.push(missionId);
            await user.save();
            console.log(`Mission added to user ${userId}`);
            return true;
        } else {
            console.log("Mission already exists for the user");
            return false;
        }
    } catch (error) {
        console.error("Error adding mission to user:", error);
        return false;
    }
};

module.exports = {
    Directeur,
    addMission

}


// module.exports = model("user", UserSchema);
