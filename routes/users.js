const router = require('express').Router();
let Person = require('../models/user.model');
const mongoose = require('mongoose');


// router.get('/', (req, res) => {
//     Person.find()
//         .then(persons => res.json(persons))
//         .catch(err => res.status(400).json('Error: ' + err));
// });

// router.route('/add').post((req, res) => {
//     const firstName = req.body.firstName;
//     const lastName = req.body.lastName;
//     const username = req.body.username;
//     const password = req.body.password;
//     const email = req.body.email;
//     const specializations = req.body.specializations;
//     const managerCommunities = req.body.managerCommunities;

//     const newPerson = new Person({
//         firstName,
//         lastName,
//         username,
//         password,
//         email,
//         specializations,
//         managerCommunities
//     });

//     newPerson.save()
//         .then((result) => {
//             res.json({
//                 message: 'User added!',
//                 user: result
//             })
//         })
//         .catch(err => res.status(400).json('Error: ' + err));
// });

router.route('/:id').get((req, res) => {
    Person.findById(mongoose.Types.ObjectId(req.params.id))
        .then(person => res.json(person))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {

    Person.findById(mongoose.Types.ObjectId(req.params.id))
        .then(person => {
            person.firstName = req.body.firstName;
            person.lastName = req.body.lastName;
            person.username = req.body.username;
            person.password = req.body.password;
            person.email = req.body.email;
            // person.specializations = req.body.specializations;
            // person.managerCommunities = req.body.managerCommunities;

            person.save()
                .then(() => { res.json('Person update!') })
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;