const jwt= require('jsonwebtoken');


//export midleware function that has req, res object
module.exports = function(req,res,next){
    //Get token from header, we are looking for x-auth-token
    const token =req.header('x-auth-token');
    

    //Check if no token
    if(!token){
        return res.status(401).json({msg: 'No token, athorization denied'})
    }

    //Verify if there is a token and if it is valid, if not catch
    try{
        
        //Decode it through jwt.verify
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        //Set decoded to req.user. We can use req.user in any of our routs latter on. For instance to get users profile.
        
        req.user= decoded.user;
        
        next();
    }catch(err){

        res.status(401).json({ msg: 'Token is not valid'});

    }

}