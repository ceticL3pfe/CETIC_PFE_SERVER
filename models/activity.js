const { Schema, model } = require("mongoose");
const { User } = require('./User')
const activitySchema = new Schema(
    {

        username: {
            type: String,
            required: true,
        },
        action: { type: String, required: true }


    },
    { timestamps: true }
);

const Activity = model('activity', activitySchema)


const getActivities = async () => {
    const activities = await Activity.find();

    return activities;
};


const addActivity = async (username, action) => {
    console.log("username, action", username, action)
    try {
        const user = new Activity({
            username,
            action

        })
     const rep =    await user.save()
        if (!rep) {
            console.log("failed while saving activity");
            return false;
        }



     
        console.log(`activity saved  for ${username}`);
        return true;

    } catch (error) {
        console.error("Error while saving acctivity to db:", error);
        return false;
    }
};

module.exports = {
    Activity,
    getActivities,
    addActivity,
}


