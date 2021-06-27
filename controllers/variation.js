var Variation = require('../models/variation.model');
var Product = require('../models/product.model');
var Attribute = require('../models/attribute.model');
var mongoose = require('mongoose');

const getAllVariations = (req, res) => {
        console.log("inside")

        Variation.find().populate({ path: 'product' }, { path: 'attribute' }, { path: 'term' })
                .then(variations => res.json(variations))
                .catch(err => res.status(400).json('Error: ' + err));
}

const getVariationById = (req, res) => {
        Variation.findById(mongoose.Types.ObjectId(req.params.id))
                .then(variation => res.json(variation))
                .catch(err => res.status(400).json('Error: ' + err));
}


const newVariation = async (req, res) => {
        console.log("inside")
        const { image, product, attribute, term, price } = req.body;
        const variation = new Variation({
                image, product, attribute, term, price
        })
        console.log("variation", variation);
        await variation.save().then(() => {
                Product.findById(variation.product).then(async (p) => {
                        await p.variations.push(variation);
                        await p.save();
                });
                Attribute.findById(variation.attribute).then(async (a) => {
                        await a.variations.push(variation);
                        await a.save();
                })
                console.log(variation)
                return res.status(201).json({
                        variation
                })
        })
                .catch((err) => {
                        console.log(err);
                        res.status(201).json({
                                "message:": "erorr"
                        })
                });
}

const editVariation = async (req, res) => {
        await Variation.updateOne({ _id: req.params.id }, req.body).then(() => {
                console.log('update variation!!')
                return res.status(201).json({
                        "messege": "update variation"
                })
        }).catch(error => {
                console.log('err 500 update variation')
        })

}

const deleteVariation = async (req, res) => {

        await Variation.deleteOne({ "_id": req.params.id }, function (err, obj) {
                if (err) throw err;
                console.log("1 document deleted");
        });
}

module.exports = {
        getAllVariations,
        getVariationById
        newVariation,
        editVariation,
        deleteVariation
}

