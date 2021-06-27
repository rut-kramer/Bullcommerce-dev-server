const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bullcommerceHeaderSchema = new Schema({

        store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
        sliderImages: [{ type: String }],
        title: { type: mongoose.Schema.Types.ObjectId, ref: "TextDesign" },
        button: { type: mongoose.Schema.Types.ObjectId, ref: "ButtonDesign" },
        stepperColor: { type: String },
        sliderArrowsColor: { type: String },
        sliderArrowsBackgroundcolor: { type: String },
}, {
        timestamps: true,
});

const BullcommerceHeader = mongoose.model('BullcommerceHeader', bullcommerceHeaderSchema);

module.exports = BullcommerceHeader;