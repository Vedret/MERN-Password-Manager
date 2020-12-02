const express = require ('express');
const router = express.Router();
const auth = require ('../../middleware/auth');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const { check,validationResult }=require('express-validator');



const User = require ('../../models/User');

//@route GET api/auth
//@desc TEST route
//@acess Public

//By ading    "auth" we make this route protected
router.get('/',auth, async (req,res)=>{
    try{
    const user = await  User.findById(req.user.id).select('-password');
    res.json(user);
}catch(err){
    console.error(err.message);
    res.status(500).send('Server Error');
}
});

//@route POST api/auth
//@desc Authenticate user and get token
//@acess Public
router.post('/',[
    check('email','Please include a valid email').isEmail(),
    check('password',
    'Password is required').exists()
],
async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return res.status(400).json({ errors});
    }

    const {email, password }=req.body;

    try{

    // Check if user exists
    let user=await User.findOne({email});
    if(!user){
       return  res.status(400).json({errors: [{ msg: 'Invalid credentials' }] });
    }

    const isMatch= await bcrypt.compare(password,user.password);
    if(!isMatch){
        if(!user){
            return  res.status(400).json({errors: [{ msg: 'Invalid credentials' }] });
         }
    }
     //get the payload which incudes a user id
    const payload={
        user: {
            id: user.id
        }
    };
    //Sign the token
    jwt.sign(payload, process.env.JWT_TOKEN,{expiresIn: 360000},
        (err,token) =>{
            if(err)throw err;
            res.json({ token });
    }
    );

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');

    }
   
});

module.exports = router;