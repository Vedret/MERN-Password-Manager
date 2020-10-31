const mongoose = require('mongoose');


const connectDB=async()=>{
    console.log(process.env.MONGO_URI)
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology: true 
        });

        console.log('MongoDB Connected....');
    }catch(err){
        console.error('MongoDB Error Connecion....');
        //exit process with failure
        process.exit(1);
    }
}

module.exports=connectDB;