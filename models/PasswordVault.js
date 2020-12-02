const mongoose=require('mongoose');

const PasswordVaultSchema= new mongoose.Schema({

    vaultName: {
        type: String
    },
    vaultTitle: {
        type: String
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