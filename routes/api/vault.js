const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator/check');
const vaultController = require('../../controllers/vaultController');
const userController = require('../../controllers/userController');
const { roles } = require('../../controllers/roles')
const Vault = require('../../models/Vault');
const User = require('../../models/User');


//@route GET api/vaults/vaultId
//@desc GET  vault by Id 
//@acess Private
router.get('/:vault_id',auth, async (req, res) => {
    try {
        
        const vault = await Vault.findById({ _id: req.params.vault_id })
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

//@route POST api/vault
//@desc POST create or update  vault
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
    const{vaultName, vaultTitle, vaultDescription, assignedTo} = req.body;
    //Build vault object
    const vaultFields={};
    vaultFields.assignedTo= {};
    vaultFields.assignedTo=assignedTo;
    
    vaultFields.vaultOwner =  req.user.id;
    if(vaultName) vaultFields.vaultName = vaultName;
    if(vaultTitle) vaultFields.vaultTitle = vaultTitle;
    if(vaultDescription) vaultFields.vaultDescription = vaultDescription;

   
    
    try{
        //since we are using moonose method we need to use 'await' becouse of return of promise
        let vault = await Vault.findOne({vaultName: vaultName});
        console.log(assignedTo);
         
            //Check if there is already vault with same name
            if(vault){
            //Check if user has global write permission
            const permissionAdminRole = roles.can(req.user.role)['updateAny' ]('profile');
            //Check if user is allowed to write on vault level
            const permissionWriteToVault= vault.assignedTo.some(assignedTo => (assignedTo.id === req.user.id)&&(assignedTo.write===true))
             //Check if you have any permission to update                     //Check if user is owner of vault
             if (permissionAdminRole.granted || permissionWriteToVault || vaultFields.vaultOwner === req.user.id ) {    
             //Update
            vault = await (await Vault.findOneAndUpdate({ vaultName: vaultName },{$set: {assignedTo: vaultFields.assignedTo, vaultTitle: vaultFields.vaultTitle, vaultDescription: vaultFields.vaultDescription}},{new: true}));
            console.log('Updated')
            return res.json(vault);
            }res.json("You don't have enough permission to perform this action");
            
           }   
        //If not found, then create new object and save it to DB  
        if(!vault){             
                 
            vault = new Vault(vaultFields);         
            await vault.save();
            res.json(vault);
        }
           
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
        const allVaults = await Vault.find();
        res.json(allVaults);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route DELETE api/vault
//@desc DELETE  Vault
//@acess Private
router.delete('/',auth, async (req, res) => {
    try {
        //Get vaulname from body to delete
        const{vaultName} = req.body;

        //Remove vault
        await Vault.findOneAndDelete({vaultName: vaultName})
        res.json({ msg: 'Vault deleted'});
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;