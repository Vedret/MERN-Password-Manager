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
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/vault', require('./routes/api/vault'));
app.use('/api/vault/login', require('./routes/api/login'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>console.log(`Server started on port ${PORT}`));