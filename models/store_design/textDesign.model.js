const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//תכונה למוצר
const textDesignSchema = new Schema({

        textContent: { type: String },
        textSize: { type: String },
        textAlignment: { type: String, default: "center" },
        display: { type: Boolean, default: true },
        textColor: { type: String, default: "#FFFFFF" },
        paddingTop: { type: Number }
}, {
        timestamps: true,
});

const TextDesign = mongoose.model('TextDesign', textDesignSchema);

module.exports = TextDesign;
