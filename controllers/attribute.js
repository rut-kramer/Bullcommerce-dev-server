var Attribute = require('../models/attribute.model');
var Product = require('../models/product.model');
var Store = require('../models/store.model');
const request = require('request');
var termController = require('../controllers/term');
var Term = require('../models/term.model');

var mongoose = require('mongoose');

const getAllAttributes = async (req, res) => {
        Attribute.find()
                .then(attrs => res.json(attrs))
                .catch(err => res.status(400).json('Error: ' + err));
}

const getAttributeById = (req, res) => {
        Attribute.findById(mongoose.Types.ObjectId(req.params.id))
                .then(attr => res.json(attr))
                .catch(err => res.status(400).json('Error: ' + err));
}
const newTerm = (name, idA, description) => {
        console.log("newTerm")
        return new Promise((resolve, reject) => {
                // const { name, description, attribute } = req.body;
                const term = new Term({
                        "name": name,
                        "description": description,
                        "attribute": idA
                })
                term.save()
                        .then((ter) => { resolve(ter._id); console.log(ter); })
                        .catch((err) => {
                                console.log("can't create new term", err);
                                reject(err);
                        })


        })
}
const newAttribute = async (req, res) => {
        console.log("attr product");

        const { name, store, slug, terms } = req.body;
        console.log("terms ", terms);
        const attribute = new Attribute({
                name,
                store,
                slug,
        })

        // Product.find({
        //         "_id": {
        //                 "$in": products.map(function (obj) {
        //                         return mongoose.Types.ObjectId(obj)
        //                 })
        //         }
        // }).then(async p => {
        //         if (p != null) {
        //                 p.forEach(async (x) => {
        //                         if (x.attributes.length > 0)
        //                                 x.attributes.push(attribute);
        //                         else {
        //                                 x.attributes = new Array(attribute)
        //                         }
        //                         await x.save();
        //                 })

        //         }
        // }).catch(err => res.status(400).json('Error: ' + err))

        attribute.save()
                .then(async (attr) => {

                        Store.findById(attribute.store._id).then(async s => {
                                if (s) {
                                        if (Array.isArray(s.attributes) && s.attributes.length)
                                                s.attributes.push(attribute);
                                        else {
                                                s.attributes = new Array(attribute)
                                        }
                                        await s.save();
                                }
                        }).catch(err => res.status(400).json('Error: ' + err));

                        console.log("hi hi hi");
                        // attr.terms = new Array();
                        if (terms) {
                                // attr.terms = new Array();
                                Promise.all(terms.map(async (element, Index) => {
                                        const idTerm = await newTerm(element.name, attr._id, element.description)
                                        console.log("ttttttttttttttttt", idTerm)
                                        await attr.terms.push(idTerm);
                                        console.log("attr with term", attr);
                                })
                                ).then(async () => {
                                        await attr.save()
                                        console.log('success', attr)
                                        let attrP = await Attribute.findById(attr._id).populate('terms')

                                        res.json(attrP);
                                }).catch(err => console.log(err))
                        }
                })
}

const editAttribute = async (req, res) => {

        await Attribute.updateOne({ _id: req.params.id }, req.body).then((a) => {
                console.log('update Attr!!', a)
                return res.status(201).json(a)
        }).catch(error => {
                console.log('err 500 update Store')
        })

}

const deleteAttribute = async (req, res) => {
        console.log("deletAttr");
        Attribute.findById(req.params.id).then(async attr => {
                console.log("attr", attr);
                await Product.updateMany(
                        {
                                "_id": {
                                        $in: attr.products.map(function (obj) {
                                                return mongoose.Types.ObjectId(obj)
                                        })
                                }
                        },
                        {
                                $pull: { attributes: mongoose.Types.ObjectId(req.params.id) }
                        },
                        function (err, obj) {
                                if (err) throw err;
                                console.log("The products who contains this attribute updated!");
                        }
                )
        })
        //$set: { address: "Canyon 123" }

        await Attribute.deleteOne({ "_id": req.params.id }, function (err, obj) {
                if (err) throw err;
                console.log("1 document deleted");
                res.status(201).json({
                        "messege": "deleted"
                })
        });
}

const getAttributesByStore = async (req, res) => {
        await Attribute.find({ "store": req.params.storeId })
                .populate("terms")
                .then(s => {
                        res.json(s)
                });
}

module.exports = {
        getAllAttributes,
        getAttributeById,
        editAttribute,
        newAttribute,
        deleteAttribute,
        getAttributesByStore
}

