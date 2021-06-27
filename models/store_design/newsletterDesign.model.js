const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//תכונה למוצר
const newsletterDesignSchema = new Schema({

        store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
        title: { type: mongoose.Schema.Types.ObjectId, ref: "TextDesign" },
        subTitle: { type: mongoose.Schema.Types.ObjectId, ref: "TextDesign" },
        image: { type: String },
        textboxColor: { type: String }

}, {
        timestamps: true,
});

const NewsletterDesignSchema = mongoose.model('NewsletterDesign', newsletterDesignSchema);

module.exports = NewsletterDesignSchema;