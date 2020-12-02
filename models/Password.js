const mongoose=require('mongoose');

const PasswordSchema = new mongoose.Schema({
    userName: {
        type: String
    },
    password: {
        type: String
    },
    expire: {
        type: Date
    },
   
});