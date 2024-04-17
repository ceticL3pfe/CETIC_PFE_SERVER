const { Schema, model } = require("mongoose");
const ControlleurDeGestionSchema = new Schema(
    {
        matricule: {
            type: String,
            ref: "compte",
            required: true
        },

      

    },
    { timestamps: true }
);

const ControlleurDeGestion = model('controlleurDeGestion', ControlleurDeGestionSchema)



module.exports = {
    ControlleurDeGestion,

}


// module.exports = model("user", UserSchema);
