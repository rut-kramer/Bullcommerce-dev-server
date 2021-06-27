const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const featuredProductsSchema = new Schema({

        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        description: { type: String },
        priceAfterDiscount: { type: Number },
        startDate: { type: Date },//member in... optional
        endDate: { type: Date },
        store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
}, {
        timestamps: true,
});

const FeaturedProducts = mongoose.model('FeaturedProducts', featuredProductsSchema);

module.exports = FeaturedProducts;