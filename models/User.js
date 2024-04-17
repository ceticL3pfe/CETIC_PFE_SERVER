const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "stc",
      enum: ["agentTc", "directeur", "admin", "commission","controlleurDeGestion"]
    },
  
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const User = model('compte', UserSchema)






const editPassword = async (password, email) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: email },
      { password: password },
      { new: true } // to return the updated document
    );

    if (!user) {
      console.log("User not found");
      return false;
    }

    console.log("Password updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating password:", error);
    return false;
  }
};

module.exports = {
  User,

  editPassword
}


// module.exports = model("user", UserSchema);
