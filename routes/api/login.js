
// Vaults login to store accounts
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator/check');

const Login  = require('../../models/Login');

//@route POST api/Login
//@desc create new Login
//@acess Private

router.post('/', [auth, [
    check('title', 'Title is required').notEmpty(),
    check('password', 'Password is required').notEmpty(),
    check('userName', 'User name is required').notEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json( { errors: error.array()} )
    }

    try {
    //Pulling all fields from request body
    const{title ,userName, password, vault_id} = req.body;
    //Get PasswordVault
    

    //Build Login object
    const loginFields = {
        title,
        userName,
        password,
        vault: vault_id
    };
    // Check if it exists
    let  loginObject = await Login.findOne({userName: userName});
    //If exists, then update
    if(loginObject){
        //Update
        loginObject = await Login.findOneAndUpdate({ userName: userName },{$set: loginFields},{new: true});
        return res.json(loginObject);
    }
    //If not found, then create new object and save it to DB 
       loginObject = new Login(loginFields);         
        await loginObject.save();
        res.json(loginObject);    


    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
    
});

//@route GET api/Logins  
//@desc get all Logins from Vault 
//@acess Private
router.get('/:passwordvault_id', auth, async (req, res) => {
    try {

        const login = await Login.findById({ passwordVault: req.params.vault_id })
        res.json(vault);

        if (!vault)
            return res.status(400).json({ msg: 'Vault not foud' });
        
    } catch (error) {
        console.error(err.message);
        //check for certain type of message for non ObjectIds
        if(err.kind == 'ObjectId'){
            return res.status(400).json({ msg: 'Vault not foud' });
        }
        res.status(500).send('Server error')
        
    }

});


module.exports = router;