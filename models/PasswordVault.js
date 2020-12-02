const mongoose=require('mongoose');

const PasswordVaultSchema= new mongoose.Schema({

    vaultName: {
        type: String,
        required:true,
        unique:true

    },
    vaultTitle: {
        type: String,
        required:true
        
    },
    
    vaultDescription: {
        type: String
    },
    vaultOwner: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'user'
   },
   people: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
}]
    

});
module.exports=PasswordVault=mongoose.model('passwordVault',PasswordVaultSchema);