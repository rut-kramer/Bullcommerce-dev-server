const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
        name: { type: String, required: true },//חובה
        description: { type: String },
        amount: { type: Number, default: 1, required: true },//חובה! בברירת מחדל יהיה 1
        SKU: { type: String, required: true },//חובה- כמו מס' ת"ז של מוצר
        //חובה
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
        //חובהrequired: true 
        store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", },
        //חובה- בברירת מחדל יהיה 0
        price: { type: Number, default: 0, required: true },
        image: { type: String },
        attributes: {
                type: [{
                        attribute: { type: mongoose.Schema.Types.ObjectId, ref: "Attribute" },
                        terms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Term" }]
                }]
        },

        featured: { type: Boolean, default: false },
        
        salePrice: { type: Number, default: 0},
        photoGallery:[{ type: String }],
        video:{ type: String },
        isStock:{ type: Boolean},
        isDraft:{ type: Boolean},
        weight: { type: Number}

        // לשאול את יהודית למה היא התכוונה
        // variations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variation" }]

}, {
        timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;