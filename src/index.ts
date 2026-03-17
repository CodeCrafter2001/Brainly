import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import express from 'express';
import {z} from 'zod';
import bcrypt from "bcrypt";
import { UserModel,LinkModel,ContentModel } from './db.js';
import cors from "cors";
import { userMiddleware } from './middleware.js';
import { JWT_PASSWORD } from './config.js';
import { error } from 'node:console';
const app= express();
app.use(express.json());
app.use(cors());

//zod validation
const signupSchema= z.object({
    username: z.string().min(3).max(30),
    password: z.string().min(6).max(100);
})
const signinSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6).max(100),
});

//signup route
app.post("/api/v1/signup",async (req,res)=>{
const parseData= signupSchema.safeParse(req.body);
if(!parseData.success){
    return res.status(400).json({
        msg:"invail input",
        error: parseData.error.flatten(),
    });
}
   const {username,password} = parseData.data;
    try{
        const existingUser= await UserModel.findOne({username});
        if(existingUser) {
            return res.status(409).json({
                message:"user already exist",
            });
        }
        const hashedPassword= await bcrypt.hash(password,10);

        await UserModel.create({
            username: username,
            password: hashedPassword,
        })
        res.json({
            message:"User signed Up"
        })
    }catch(e){
        res.status(401).json({
            message:"User already exists"
        })
    }
    

})

//signup route
app.post("/password/v1/signin ",async(req,res)=>{
const username= req.body.username;
const password= req.body.password;
const existingUser= await UserModel.findOne({
    username,
    password
})
if(existingUser){
    const token= jwt.sign({
        id: existingUser._id
    }, JWT_PASSWORD);
    res.json({
    })

}else{
res.status(403).json({
    message:"Incorrect credentials"
})
}
})

//post content route
app.post("/api/v1/content",userMiddleware,async (req,res)=>{
const link= req.body.link;
const type= req.body.type;
await ContentModel.create({
    link,
    type,
    title: req.body.title,  
    userId: req.userId,
    tags:[]
})
res.json({
    message: "content added"
})
})

// get content route
app.get ("/api/v1/content",userMiddleware, async(req,res)=>{

})
app.delete ("/api/v1/content",(req,res)=>{

})
app.post ("/api/v1/brain/share",(req,res)=>{

})
app.get ("/api/v1/brain/:shareLink",(req,res)=>{

})

app.listen(3000,()=>{
    console.log("server is listening on port 3000");
});