var Term = require('../models/term.model');
var Product = require('../models/product.model');
var Attribute = require('../models/attribute.model');
var Store = require('../models/store.model');
var mongoose = require('mongoose');

const getAllTerms = async (req, res) => {
        Term.find()
                .then(attrs => res.json(attrs))
                .catch(err => res.status(400).json('Error: ' + err));
}

// const getAttributeById = (req, res) => {
//         Attribute.findById(mongoose.Types.ObjectId(req.params.id))
//                 .then(attr => res.json(attr))
//         // .catch(err => res.status(400).json('Error: ' + err));
// }
const newTerm = async (req, res) => {

        const { name, description, attribute } = req.body;
        const term = new Term({
                name,
                description,
                attribute
        })

        await term.save()
                .then((ter) => {
                        console.log("term product", ter);

                        Attribute.findById(ter.attribute._id).then((a) => {
                                console.log("attr", a)
                                if (Array.isArray(a.terms) && a.terms.length) {
                                        a.terms.push(ter);
                                }
                                else
                                        a.terms = new Array(ter);
                                a.save().then(s => console.log("add term " + ter.name + " to attribute " + s.name))
                        })
                        res.status(200).json(ter); console.log(ter);
                })
                .catch(err => console.error("can't create new term", err));
}
//צריך למחוק מתכונות את המונח
const deleteTerm = async (req, res) => {

        Term.deleteOne({ "_id": req.params.id }, function (err, obj) {
                if (err) throw err;
                else {
                        console.log("1 term deleted");
                        res.status(201).json({
                                "messege": "deleted"
                        })
                }
        });
}

// const getAttributesByStore = async (req, res) => {
//         await Store.findById(req.params.storeId).populate("attributes")
//                 .then(s => {
//                         res.json(s.attributes)
//                 });
// }

module.exports = {
        getAllTerms,
        // getAttributeById,
        newTerm,
        deleteTerm
}

