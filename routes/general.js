const router = require('express').Router();
let Post = require('../models/post.model');
let Community= require('../models/community.model');

// router.route('/all-advertisements/:communityId').get((req,res)=>{

//     // dbo.collection("customers").findOne({}, function(err, result) {
//     //     if (err) throw err;
//     //     console.log(result.name);
//     //     db.close();
//     //   });
//     let community;
//     Community.findOne({"_id":req.params.communityId},()=>{

//     })
//     Post.find()
//     .then(posts => res.json(posts))
//     .catch(err => res.status(400).json('Error: '+err));
// });



module.exports = router;