const express = require ('express');
const router=express.Router();
const auth = require ('../../middleware/auth')
const { check, validationResult } = require('express-validator/check');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route GET api/profile/me
//@desc GET current users profile
//@acess Private
router.get('/me',auth, async (req,res)=>{
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate('User',['name','avatar']);
        if(!profile){
            return res.status(400).json({msg : 'There is no profile for this user !! '});
        }
        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route POST api/profile/me
//@desc Create or update user profile
//@acess Private
router.post('/',[auth, [check('status', 'Status is required').not().isEmpty()]], async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const{
        company,
        location,
        status
    } = req.body;
    //Buld profile objct
    const profileFields = {}
    profileFields.user = req.user.id;
    if(company) profileFields.company=company;
    if(location) profileFields.location=location;
    if(status) profileFields.status=status;

    console.log(profileFields);
    res.send('Hello')
});

module.exports = router;