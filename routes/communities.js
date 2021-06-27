const router = require('express').Router();
let Community = require('../models/community.model');
const mongoose = require('mongoose');


router.route('/').get((req,res)=>{
    debugger;
    Community.find()
    .then(communities => res.json(communities))
    .catch(err => res.status(400).json('Error: '+err));
});

router.route('/:id').get((req,res)=>{
    Community.findById(mongoose.Types.ObjectId(req.params.id))
    .then(community=>res.json(community))
    .catch(err => res.status(400).json('Error: '+err));
});

router.route('/add').post((req,res) => {
    const communityName = req.body.communityName;
    const communityDescription = req.body.communityDescription;
    const communityManager =mongoose.Types.ObjectId(req.body.communityManager) ;
    const communityMembers = req.body.communityMembers;
    
    const newCommunity = new Community({
        communityName,
        communityDescription,
        communityManager,
        communityMembers
    });

    newCommunity.save()
    .then((result) => {res.json({
            message:'Community added!',
            community: result
        })
    })
    .catch(err => res.status(400).json('Error: '+err));
});

router.route('/update/:id').post((req,res)=>{
    Community.findById(req.params.id)
    .then(community=>{
        community.communityName=req.body.communityName;
        community.communityDescription=req.body.communityDescription;
        community.communityManager=req.body.communityManager;
        community.communityMembers=req.body.communityMembers;
        community.posts=req.body.posts;
        
        community.save()
        .then(() => {res.json('community update!')})
        .catch(err => res.status(400).json('Error: '+err));
    })
    .catch(err => res.status(400).json('Error: '+err));; 
});

module.exports = router;