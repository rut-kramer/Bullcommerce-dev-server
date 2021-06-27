const Store = require('../models/store.model');
const Paper = require('../models/paper.model');
const mongoose = require('mongoose');

const getAllPapersOfStore = (req, res) => {
        Store.findById(req.params.storeId).populate('papers')
        .then((s) => {
                console.log("store with Paper", s);
                res.json(s.papers);
        }).catch((err)=>{ res.json(err);})
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
        const quill = new Paper({
                name, description, store,quillStyle
        })
        console.log("paperrrrrrr",quill)
        await quill.save().then((q) => {
         console.log("success")

         Store.findById(mongoose.Types.ObjectId(q.store)).then(
                (s) => {
                        if (s) {
                                console.log("ssssstttt", s);
                                if (Array.isArray(s.papers) && s.papers.length)
                                        s.papers.push(q);
                                else
                                        s.papers = new Array(q);
                                s.save().then("add to papers")
                        }
                })
                return res.status(201).json({
                        quill
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


        const newPaper = await Paper.findByIdAndUpdate(req.params.id, req.body, { new: true })
        try {
             if (newPaper)  
             {
                console.log("new: ", newPaper)
                res.status(201).send(newPaper)
             }

        // await Paper.updateOne({ _id: req.params.id }, req.body).then((p) => {
        //         return res.status(201).send(p)
        //         console.log(p)

        }
        catch(error) {
                res.status(400).json({
                        "message:": "erorr"
                })
        }

}

const deletePaper = async (req, res) => {
        console.log(req.params.id,"!!!!!!!!!!!!!!!!!!!");
        await Paper.deleteOne({ "_id": req.params.id }, function (err, obj) {
                if (err) throw err;
                else{
                console.log("1 document deleted");
            
                res.status(201).json({
                        "message:": "sucsses"
                })
                
                }
        });
}

module.exports = {
        getPaperById,
        newPaper,
        editPaper,
        deletePaper,
        getAllPapersOfStore
}

