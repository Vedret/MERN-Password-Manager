const mongoose=require('mongoose');

const LoginSchema = new mongoose.Schema({
    userName: {
        type: String,
        required:true,
        unique:true
    },
    password: {
        type: String
    },
    title: {
        type: String,
        required:true,
    },
    description: {
        type: String
    },
    expire: {
        type: Date
    },
    vault: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vault'
    }
   
});

module.exports=Login=mongoose.model('login',LoginSchema);