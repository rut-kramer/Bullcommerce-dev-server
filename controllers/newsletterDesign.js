let NewsletterDesign = require('../models/store_design/newsletterDesign.model');
let mongoose = require('mongoose')
let TextDesign = require('../models/store_design/textDesign.model');


const newNewsletterDesign = async (req, res) => {

        const { store, title, subTitle, image, textboxColor } = req.body;

        const nTitle = await new TextDesign({
                textContent: title
        });
        await nTitle.save();
        const nSubTitle = await new TextDesign({
                textContent: subTitle
        })
        await nSubTitle.save();

        const newsletterDesign = new NewsletterDesign({
                store: store,
                title: nTitle,
                subTitle: nSubTitle,
                image: image,
                textboxColor: textboxColor
        })
        newsletterDesign.save().then(n => {
                console.log("Newsletter design created", n);

                res.status(200).json({
                        _id: n._id,
                        store: n.store,
                        title: nTitle,
                        subTitle: nSubTitle,
                        image: n.image,
                        // textboxColor: n.textboxColor
                })
        }
        ).catch((error) => {
                console.error("cant create new newsletter design", error);
                res.status(400).json(error)

        })
}


const editNewsletterDesign = async (req, res) => {

        const body = req.body;

        try {

                const newNewsletterDesign = await NewsletterDesign.findByIdAndUpdate(req.params.id, body, { new: true });

                const titleD = await TextDesign.findByIdAndUpdate(newNewsletterDesign.title._id, body.title, { new: true });
                await titleD.save().then(tt => console.log("titleD", tt))

                const subTitleD = await TextDesign.findByIdAndUpdate(newNewsletterDesign.subTitle._id, body.subTitle, { new: true });
                await subTitleD.save().then(tt => console.log("subTitleD", tt));

                await newNewsletterDesign.save().then(nd => console.log("newNewsletterDesign Saved!", nd));

                if (newNewsletterDesign) {
                        res.status(201).json({
                                _id: newNewsletterDesign._id,
                                store: newNewsletterDesign.store,
                                title: titleD,
                                subTitle: subTitleD,
                                image: newNewsletterDesign.image,
                                textboxColor: newNewsletterDesign.textboxColor
                        });

                }
        }
        catch (err) {
                console.error(err)
                res.status(500).send(err)
        }

}

const getNewsletterDesignById = (req, res) => {
        NewsletterDesign.findOne({ store: mongoose.Types.ObjectId(req.params.storeId) })
                .populate("title")
                .populate("subTitle")
                .then(nd => res.json(nd))
                .catch(err => res.status(400).json('Error: ' + err));
}

module.exports = {
        newNewsletterDesign,
        editNewsletterDesign,
        getNewsletterDesignById
}
