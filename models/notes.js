const mongoose=require('mongoose')


noteSchema=mongoose.Schema({
 
    note:{type:Number,required:true},
    evaluation:{type:String,required:true},
    idCour:{type:String,required:true,ref:'Cour'},
    idStudent:{type:String,required:true,ref:'User'},
},
{timestamps:true})

const Note=mongoose.model('Note',noteSchema)


module.exports=Note
