
const jwt=require("jsonwebtoken")
const User=require("../schema/user")

const Authenticate=async(req,res,next)=>{
    try{
   const token=req.cookies.jwtoken;
   console.log(token)
   const verifytoken=jwt.verify(token,process.env.SECRET_KEY)
   console.log(verifytoken)
   const rootUser=await User.findOne({_id: verifytoken._id,"tokens.token":token})
   console.log(rootUser)
   if(!rootUser)
   {
       throw new Error("User not found")
   }
   req.token=token;
   req.rootUser=rootUser;
   req.userID=rootUser._id;
   next();
    }catch(err){
       res.status(401).send("Unauthorized:No token provided")
       
       console.log(err);
    }

}
module.exports=Authenticate