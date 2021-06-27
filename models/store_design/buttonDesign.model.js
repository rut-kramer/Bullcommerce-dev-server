const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//תכונה למוצר
const buttonDesignSchema = new Schema({

        store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
        buttonText: { type: mongoose.Schema.Types.ObjectId, ref: "TextDesign" },
        width: { type: Number },
        height: { type: Number },
        backgroundColor: { type: String },
        borderRadius: { type: String },
        border: { type: mongoose.Schema.Types.ObjectId, ref: "BorderDesign" }

}, {
        timestamps: true,
});

const ButtonDesign = mongoose.model('ButtonDesign', buttonDesignSchema);

module.exports = ButtonDesign;