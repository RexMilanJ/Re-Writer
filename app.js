const express = require("express");
const app = express();
const mongoose= require("mongoose")
app.use(express.json())
const cors = require("cors")
app.use(cors());
const bcrypt=require("bcryptjs")

const jwt = require("jsonwebtoken")
const JWT_SECRET = "fjsaiisfkfsmdasfjk187980ioior[sf'sa;kjcnhoiu9w10wiodjkj";

const mongoUrl ="mongodb://rexmilan:Rex%40milan28@ac-v7ewa4k-shard-00-00.9ib3niy.mongodb.net:27017,ac-v7ewa4k-shard-00-01.9ib3niy.mongodb.net:27017,ac-v7ewa4k-shard-00-02.9ib3niy.mongodb.net:27017/?ssl=true&replicaSet=atlas-adwuk2-shard-0&authSource=admin&retryWrites=true&w=majority"
mongoose.connect(mongoUrl,{
    useNewUrlParser:true,})
    .then(()=>{
    console.log("connected to database");
})
.catch(e=>console.log(e));

require("./userDetails");

const User = mongoose.model("UserInfo");
app.post("/register", async(req,res)=>{
    const {fname,lname,email,password}=req.body;

    const encryptedPassword = await bcrypt.hash(password,10);
    try {
        const oldUser = await User.findOne({email});

        if(oldUser){
            return res.send({error:"User Exists"});
        }
        await User.create({
            fname:fname,
            lname:lname,
            email:email,
            password:encryptedPassword,
        });
        res.send({status:"ok"})
    } catch (error) {
        res.send({status:"error"})
    }
});

app.post("/login-user",async(req,res)=>{
    const{email,password}=req.body;
    const user =await User.findOne({email})

    if(!user){
        return res.send({error:"User not found"});
    }
    if(await bcrypt.compare(password,user.password)){
        const token = jwt.sign({email: user.email},JWT_SECRET);

        if(res.status(201)){
            return res.json({status:"ok", data: token});
        }
        else{
            return res.json({error:"error"});
        }
    }
    res.json({status:"error", error:"Invalid password"})
});

app.post("/userData",async(req,res)=>{
    const {token}= req.body;
    try {
        const user= jwt.verify(token,JWT_SECRET);
        console.log(user);

        const useremail= user.email;
        User.findOne({email:useremail})
        .then((data)=>{
            res.send({status:"ok",data: data});
        })
        .catch((error)=>{
            res.send({status:"error",data: error});
        });
    } catch (error) {
        
    }
})

app.post("/dash", async(req,res)=>{
    const {doc}=req.body;
    try {
        
    } catch (error) {
        
    }
})

app.listen(5000,()=>{
    console.log("server started")
})
