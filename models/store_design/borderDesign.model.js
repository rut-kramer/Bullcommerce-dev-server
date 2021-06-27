const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//תכונה למוצר
const borderDesignSchema = new Schema({

        store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
        size: { type: Number },
        color: { type: String },
        style: { type: String }
}, {
        timestamps: true,
});

const BorderDesign = mongoose.model('BorderDesign', borderDesignSchema);

module.exports = BorderDesign;