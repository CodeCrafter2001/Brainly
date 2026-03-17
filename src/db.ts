import mongoose ,{Schema,model}from "mongoose";

 mongoose.connect("mongodb+srv://Brainly:Anmol%4020012004@brainly.c204sv7.mongodb.net/brainly");
 console.log("mongodb connected");

 const UserSchema= new Schema({
    username:{type: String, unique:true},
    password: String
 });
 export const UserModel= model("User", UserSchema);
 
const ContentSchema= new Schema({
    title: String,
    link:String,
    tags: [{type: mongoose.Types.ObjectId, ref:"Tag"}],
    type:String,
    userId: {type:mongoose.Types.ObjectId, ref: 'User', required: true},
})
const LinkSchema= new Schema({
    hash: String,
    userId: {type:mongoose.Types.ObjectId, ref:'User', required:true, unique: true},
})
export const LinkModel= model("Link", LinkSchema);
export const ContentModel= model("Content", ContentSchema);
