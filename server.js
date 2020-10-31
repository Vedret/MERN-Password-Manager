const express = require ('express');
const connectDB=require('./config/db')


const command=process.argv[2];
if(command =='add'){
    console.log('Adding note')
}

const app = express();

//Connect to db
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

app.get('/',(req,res)=>res.send('API Running'));

//Define Routes
//userRoutes=require('./routes/api/user');
app.use('/api/users', require('./routes/api/user'))
app.use('/api/suth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
//app.use('/api/posts', require('./routes/api/posts'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>console.log(`Server started on port ${PORT}`));