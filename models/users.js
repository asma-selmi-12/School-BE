const mongoose = require('mongoose');


const UserSchema=mongoose.Schema({
firstName:{type:String,trim:true},
lastName:{type:String,trim:true},
email:{type: String,unique:true},
tel:{type: String,unique:true},
pwd:String,
adresse:String,
img:String,
cv:String,
role:String,
statut:Boolean,
specialite:String,
telStudent: String 



},{timestamps:true,strict:false})


const User=mongoose.model('User',UserSchema)

module.exports=User