const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const categoryDesignSchema = new Schema({

    categoryData: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    imageCategory: { type: String },
    statusShow: { type: Boolean, default: true },
    indexInMenu: { type: Number },
    categoryTitle: { type: mongoose.Schema.Types.ObjectId, ref: "TextDesign" }
}, {
    timestamps: true,
});

const CategoryDesign = mongoose.model('CategoryDesign', categoryDesignSchema);

module.exports = CategoryDesign;