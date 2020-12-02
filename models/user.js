const mongoose=require('mongoose');

const UsersSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password: {
        type: String,
        require:true
    },
    avatar:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    permission: [
        {          
            read: { type: Boolean, default: false, required: true  },
            write: { type: Boolean, default: false, required: true },
            delete: { type: Boolean, default: false, required: true },
        }
    ],

});
module.exports=User=mongoose.model('User',UsersSchema);