const mongoose=require("mongoose")
const dotenv=require("dotenv")
const express=require("express")
const cookieparser=require("cookie-parser");

dotenv.config({path:"server/config.env"})
require("./db/connect")
const app=express()

app.use(express.json())
app.use(cookieparser());
app.use(require("./router/route"))



const PORT=process.env.PORT


app.get("/",(req,res)=>{
    res.send("This is home page")
})

app.get("/contact",(req,res)=>{
    res.cookie("test","ikra")
    res.send("This is contact page")
})
app.get("/signin",(req,res)=>{
    res.send("This is login page")
})
app.get("/signup",(req,res)=>{
    res.send("This is register page")
})
app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
})