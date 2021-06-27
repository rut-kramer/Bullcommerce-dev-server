
var HeaderDesign = require('../models/store_design/bullcommerceHeader.model');
var mongoose = require('mongoose')
let Title = require('../models/store_design/textDesign.model');
let Button = require('../models/store_design/buttonDesign.model');

const newBullcommerceHeaderDesign = async (req, res) => {

    const { store, sliderImages, stepperColor, sliderArrowsColor, sliderArrowsBackgroundcolor, textContent } = req.body;
    const titleD = new Title({
        textContent: textContent
    });
    await titleD.save();
    const buttonD = new Button({})
    await buttonD.save();

    const headerDesign = new HeaderDesign({
        store,
        sliderImages,
        title: titleD,
        button: buttonD,
        stepperColor,
        sliderArrowsColor,
        sliderArrowsBackgroundcolor,

    })
    console.log("headerDesign", headerDesign);
    await headerDesign.save().then(async (header) => {
        console.log("b h d", header);

        titleD.store = header.store;
        await titleD.save();

        buttonD.store = header.store;
        await buttonD.save();

        res.json({
            _id: header._id,
            store: header.store,
            sliderImages: header.sliderImages,
            title: titleD,
            button: buttonD,
            stepperColor: header.stepperColor,
            sliderArrowsColor: header.sliderArrowsColor,
            sliderArrowsBackgroundcolor: header.sliderArrowsBackgroundcolor,
        });

    })
        .catch((err) => {
            console.log("b h d error", err);
            res.status(400).json({
                "message:": "error"
            })
        });
}

const editBullcommerceHeaderDesign = async (req, res) => {
    const body = req.body
    try {
        console.log("editBHD")

        const newHeaderDesign = await HeaderDesign.findByIdAndUpdate(req.params.id, body, { new: true });

        const buttonD = await Button.findByIdAndUpdate(newHeaderDesign.button, body.button, { new: true });
        await buttonD.save().then(bt => console.log("buttonD", bt))
        const titleD = await Title.findByIdAndUpdate(newHeaderDesign.title, body.title, { new: true });
        await titleD.save().then(tt => console.log("titleD", tt))

        await newHeaderDesign.save().then(nhd => console.log("newHeaderDesign Saved!", nhd));

        if (newHeaderDesign) {
            console.log("new: ", newHeaderDesign)
            res.status(201).json({
                _id: newHeaderDesign._id,
                store: newHeaderDesign.store,
                sliderImages: newHeaderDesign.sliderImages,
                title: titleD,
                button: buttonD,
                stepperColor: newHeaderDesign.stepperColor,
                sliderArrowsColor: newHeaderDesign.sliderArrowsColor,
                sliderArrowsBackgroundcolor: newHeaderDesign.sliderArrowsBackgroundcolor
            });

        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send(err)
    }

}

const getBHDById = (req, res) => {
    HeaderDesign.findOne({ store: mongoose.Types.ObjectId(req.params.storeId) })
        // .populate({ path: 'attributes' })
        .populate("title"
            // {
            // path: "title"
            // populate: {
            //         path: "terms"
            // }
            // }
        )
        .populate("button"
            // {
            // path: "button"
            // populate: {
            //         path: "attribute"
            // }
            // }
        )
        .then(bhd => res.json(bhd))
        .catch(err => res.status(400).json('Error: ' + err));
}


module.exports = {
    newBullcommerceHeaderDesign,
    editBullcommerceHeaderDesign,
    getBHDById
}