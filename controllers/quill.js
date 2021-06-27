const Store = require('../models/store.model');
const Paper = require('../models/paper.model');
const mongoose = require('mongoose');

const getAllPapersOfStore = (req, res) => {
}

const getPaperById = (req, res) => {
        Paper.findById(mongoose.Types.ObjectId(req.params.id))
                .then(p => res.status(200).json(p))
                .catch(err => res.status(400).json('Error: ' + err));
}


const newPaper = async (req, res) => {
   
        const { name, description, store,quillStyle} = req.body;
        console.log(name,"jnnnnnnn")
        console.log(req.body.name,"jnnnnnnn")
        const paper = new Paper({
                name, description, store,quillStyle
        })
        console.log("paperrrrrrr",paper)
        await paper.save().then(() => {
         console.log("success")
                return res.status(201).json({
                        paper
                })
        })
                .catch((err) => {
                        console.log(err);
                        res.status(400).json({
                                "message:": "erorr"
                        })
                });
}

const editPaper = async (req, res) => {
        await Paper.updateOne({ _id: req.params.id }, req.body).then((p) => {
                return res.status(201).json({
                        p
                })
        }).catch(error => {
                res.status(400).json({
                        "message:": "erorr"
                })
        })

}

const deletePaper = async (req, res) => {

        await Paper.deleteOne({ "_id": req.params.id }, function (err, obj) {
                if (err) throw err;
                console.log("1 document deleted");
        });
}

module.exports = {
        getPaperById,
        newPaper,
        editPaper,
        deletePaper
}

