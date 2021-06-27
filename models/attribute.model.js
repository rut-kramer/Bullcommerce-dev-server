const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//תכונה למוצר
const attributeSchema = new Schema({

        name: { type: String, required: true },//חובה
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
        terms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Term" }],

        // variation: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variation" }],
        // categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
        slug: { type: String }
}, {
        timestamps: true,
});

const Attribute = mongoose.model('Attribute', attributeSchema);

module.exports = Attribute;