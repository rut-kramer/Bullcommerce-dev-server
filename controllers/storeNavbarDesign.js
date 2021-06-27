let StoreNavbarDesign = require('../models/store_design/storeNavbarDesign.model');
let mongoose = require('mongoose')
let TextDesign = require('../models/store_design/textDesign.model');

const newStoreNavbarDesign = async (req, res) => {
        const { store, backgroundColor, activeTextColor, textColor } = req.body;

        const createStoreNavbarDesign = new StoreNavbarDesign({
                store: store,
                backgroundColor: backgroundColor,
                activeTextColor: activeTextColor,
                textColor: textColor
        })
        createStoreNavbarDesign.save().then(async cnd => {
                console.log("new store navbar design to store " + store, cnd);

                res.status(200).json(cnd)
        }
        ).catch((error) => {
                console.error("cant create new store navbar design", error);
                res.status(400).json(error)

        })
}

const editStoreNavbarDesign = async (req, res) => {
        const body = req.body
        try {
                const newNavbarDesign = await StoreNavbarDesign.findByIdAndUpdate(req.params.id, body, { new: true });

                await newNavbarDesign.save().then(nd => console.log("newNavbarDesign Saved!", nd));

                if (newNavbarDesign) {
                        res.status(201).json(newNavbarDesign);

                }
        }
        catch (err) {
                console.error(err);
                res.status(500).send(err);
        }

}

const getStoreNavbarDesignById = (req, res) => {
        StoreNavbarDesign.findOne({ store: mongoose.Types.ObjectId(req.params.storeId) })
                .then(nd => res.json(nd))
                .catch(err => res.status(400).json('Error: ' + err));
}

module.exports = {
        newStoreNavbarDesign,
        editStoreNavbarDesign,
        getStoreNavbarDesignById
}
