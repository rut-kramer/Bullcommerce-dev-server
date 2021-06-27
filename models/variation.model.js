const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//תכונה למוצר
const variationSchema = new Schema({

        image: { type: String },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        attribute: { type: mongoose.Schema.Types.ObjectId, ref: "Attribute", required: true },
        term: { type: mongoose.Schema.Types.ObjectId, ref: "Term", required: true }
        //ברירת מחדל כל הוריאציות אותו מחיר
        price: { type: Number }

}, {
        timestamps: true,
});

const Variation = mongoose.model('Variation', variationSchema);

module.exports = Variation;