import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import express from 'express';
import { UserModel,LinkModel,ContentModel } from './db.js';
import cors from "cors";
import { JWT_PASSWORD } from './config.js';
const app= express();
app.use(express.json());
app.use(cors());
app.post("api/v1/signup",async (req,res)=>{
    //zod validation and hash the pass
    const username= req.body.username;
    const password= req.body.password;
    try{
        await UserModel.create({
            username: username,
            password: password
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
app.post("password/v1/signin ",(req,res)=>{

})
app.post("api/v1/content",(req,res)=>{

})
app.get ("api/v1/content",(req,res)=>{

})
app.delete ("api/v1/content",(req,res)=>{

})
app.post ("api/v1/brain/share",(req,res)=>{

})
app.get ("api/v1/brain/:shareLink",(req,res)=>{

})

