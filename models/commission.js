const { Schema, model } = require("mongoose");
const CommissionSchema = new Schema(
    {
        matricule: {
            type: String,
            ref: "compte",
            required: true
        },

    },
    { timestamps: true }
);

const Commission = model('commission', CommissionSchema)



module.exports = {
    Commission,

}


// module.exports = model("user", UserSchema);
