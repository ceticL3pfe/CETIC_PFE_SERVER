const { Schema, model } = require("mongoose");
const {User} = require('./User')
const AdminSchema = new Schema(
    {

        matricule: {
            type: String,
            required: true,
            ref: "compte",
        },

    },
    { timestamps: true }
);

const Admin = model('admin', AdminSchema)


const getUsers = async () => {
    const users = await User.find();
    const filteredUsers = users.map(user => ({
        email: user.email,
        username: user.username,
        _id: user._id,
        activated: user.activated,
        role: user.role,
        mission: user.mission
    }));
    return filteredUsers;
};


const deleteUser = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            console.log("User not found");
            return false;
        }



        await user.delete();
        console.log(`user deleted ${userId}`);
        return true;

    } catch (error) {
        console.error("Error deleting  user:", error);
        return false;
    }
};

module.exports = {
    Admin,
    getUsers,
    deleteUser,
}


