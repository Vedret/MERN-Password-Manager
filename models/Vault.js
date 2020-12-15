const mongoose=require('mongoose');

const VaultSchema= new mongoose.Schema({

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
   assignedTo: [{
       
    user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
}, 
    read: { type: Boolean, default: false, required: true  },
    write: { type: Boolean, default: false, required: true },
    delete: { type: Boolean, default: false, required: true }
   }]
    

});
module.exports=Vault=mongoose.model('Vault',VaultSchema);