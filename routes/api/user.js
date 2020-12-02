const express = require ('express');
const router=express.Router();
const gravatar= require('gravatar');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');

const { check,validationResult }=require('express-validator');

const User = require('../../models/User');
const PasswordVault = require('../../models/PasswordVault');

//@route POST api/users
//@desc Register user
//@acess Public
router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check('password',
    'Please enter a password with 6 or more characters').isLength({ min: 8}).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i").withMessage('Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long')
],
async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return res.status(400).json({ errors});
    }

    //Pulling all fields from request body
    const {name, email, password }=req.body;

    try{

    // Check if user exists
    let user=await User.findOne({email});
    if(user){
       return  res.status(400).json({errors: [{ msg: 'User already exists' }] });
    }
    // Get user gravatar
    const avatar = gravatar.url(email,{
        s:'200',
        r: 'pg',
        d: 'mm'
    })

    user = new User({
        name,
        email,
        avatar,
        password
    });

    
    
    //Encrypt, hash the password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    //save the user in the db
    await user.save();
    //create first, private password vault
    vault = new PasswordVault();
    vault.vaultName=name + ' private vault';
    vault.vaultTitle = 'Private vault';
    vault.vaultOwner = user,
    vault.vaultDescription = 'The private vault for user ' + name,
    vault._id=user.id 
    await vault.save();
    
     // Return json web token

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