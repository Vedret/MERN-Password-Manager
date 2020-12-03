const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator/check');

const PasswordVault = require('../../models/PasswordVault');
const User = require('../../models/User');
const Profile = require('../../models/Profile');


//@route GET api/vaults/vaultId
//@desc GET password vault by Id 
//@acess Private
router.get('/:passwordvault_id',auth, async (req, res) => {
    try {
        
        console.log(req.params.passwordvault_id)
        const vault = await PasswordVault.findById({ _id: req.params.passwordvault_id })
        res.json(vault);

        if (!vault)
            return res.status(400).json({ msg: 'Vault not foud' });
    } catch (err) {
        console.error(err.message);
        //check for certain type of message for non ObjectIds
        if(err.kind == 'ObjectId'){
            return res.status(400).json({ msg: 'Vault not foud' });
        }
        res.status(500).send('Server error')
    }
})

//@route POST api/vaults
//@desc POST create or update password vault
//@acess Private
router.post('/',[auth,[
    check('vaultName','Name is required').notEmpty(),
    check('vaultTitle','Title is required').notEmpty()
]],async (req,res) => {

    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({ error: error.array()});
    }
    //Pulling all fields from request body
    const{vaultName, vaultTitle, vaultDescription, people} = req.body;
    //Build vault object
    const vaultFields={};
    //vaultFields.vaultOwner={};
    vaultFields.vaultOwner = await User.findOne({_id: req.user.id});
    if(vaultName) vaultFields.vaultName = vaultName;
    if(vaultTitle) vaultFields.vaultTitle = vaultTitle;
    if(vaultDescription) vaultFields.vaultDescription = vaultDescription;

    //res.send('Hello');
    //console.log(vaultFields.vaultOwner);
    try{
        //since we are using moonose method we need to use 'await' becouse of return of promise
        let passwordVault = await PasswordVault.findOne({vaultName: vaultName});
        
        //If there is vault with name then update
        if(passwordVault){
            //Update
            passwordVault = await PasswordVault.findOneAndUpdate({ vaultName: vaultName },{$set: vaultFields},{new: true});
            return res.json(passwordVault);
            
        }
            //If not found then create new one           
            password = new PasswordVault(vaultFields);         
            await password.save();
            res.json(password);
           
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route GET api/vaults
//@desc GET all passwordvaults
//@acess Private

router.get('/',auth, async (req, res) => {
    try {
        const allpasswordVaults = await PasswordVault.find();
        res.json(allpasswordVaults);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route DELETE api/vaults
//@desc DELETE  passwordVault
//@acess Private
router.delete('/',auth, async (req, res) => {
    try {
        //Get vaulname from body to delete
        const{vaultName} = req.body;

        //Remove vault
        await PasswordVault.findOneAndDelete({vaultName: vaultName})
        res.json({ msg: 'Vault deleted'});
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
module.exports = router;