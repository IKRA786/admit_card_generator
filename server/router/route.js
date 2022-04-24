const jwt=require("jsonwebtoken")
const express=require("express")
const router=express.Router()
const bcrypt=require("bcrypt")
let token;
const authenticate=require("../middleware/authenticate.js")
require("../db/connect")
const User=require("../schema/user")

router.get("/",(req,res)=>{
    res.send("This is home router page")
})
router.post("/register",async(req,res)=>{
   const{name,email,phone,work,password,cpassword}=req.body
   if(!name|| !email|| !phone|| !work|| !password|| !cpassword)
   {
      return  res.status(422).json({ error: "plzz fill field prorperly"})
   }else if(password!=cpassword){
    return  res.status(422).json({ error: "Password and confermpassword are different"})
   }
   else
   {
    try{
        const userexist=await User.findOne({email:email})
        if(userexist){
            return  res.status(422).json({message:"You are already registered"})
        }
        const user=new User({name,email,phone,work,password,cpassword})
        const saveuser=await user.save()
        if(saveuser)
        {
            res.status(201).json({message:"User registered successfully"})
        }
        else
        {
            res.status(500).json({error:"Something not right"})
        }
    }catch(err){
    console.log(err)
    }
   }
//    User.findOne({email:email}).then((userexist)=>{
//      if(userexist){
//         return  res.status(422).json({message:"You are already registered"})
//      }
//      const user=new User({name,email,phone,work,password,cpassword})
//      user.save().then(()=>{
//          res.status(201).json({message:"User registered successfully"}
//          )
//      }).catch((err)=>{
//         res.status(500).json({error:"Something not right"})
//        })

//    }).catch((error)=>{
//        console.log(error)
//    })


})
router.post("/signin",async (req,res)=>{
    try{
        const{email,password}=req.body
        if(!email||!password)
    {
        res.status(500).json({message:"Invalid syntax"})
    }
    const userex= await User.findOne({email:email})
    token=await userex.generateAuthtoken()
    console.log(token)
    res.cookie("jwtoken",token,{
    expires:new Date(Date.now()+25892000000),
    httpOnly:true
    })
    
    if(userex)
    {
        const confirm=await bcrypt.compare(password,userex.password)
        if(confirm){
            res.status(200).json({message:"User login successfully"})
         }else
         {
             res.status(400).json({message:"Invalid syntax"})
         }
    }
    else
    {
        res.status(400).json({message:"You are not registered"})
    }
    
    }catch(err){
        console.log(err)
    }
})
router.get('/aboutus',authenticate,async(req,res)=>{
    res.send(req.rootUser)
})
router.get('/getdata',authenticate,async(req,res)=>{
    res.send(req.rootUser)
})
router.post('/contact',authenticate,async(req,res)=>{
    try{
      const{name,email,phone,message}=req.body;
      if(!name||!email||!phone||!message)
      {
         return res.json({error:"Please fill contact form"})
      }
      const userAccount=await User.findOne({ _id:req.userID})
      if(userAccount)
      {
          const userMessage=await userAccount.addMessage(name,email,phone,message)
          await userAccount.save()
          res.status.json({message:"User contact sucessfully"});
      }
    }catch(err)
    {
        console.log(err)
    }
})
router.get("/logout",(req,res)=>{
    console.log("Hello Logout")
    res.clearCookie('jwtoken',{path:'/'})
    res.status(201).send("User Logout")
})
module.exports=router