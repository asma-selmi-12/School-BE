const mongoose=require('mongoose')


const classeSchema=mongoose.Schema({

    name:{type:String, required:true,trim:true},
    
    students:[{type:String,required:true,ref:'User'}],
    idCour:{type:String, required:true,ref:'Cour'}

},{timestamps:true})

const Classe=mongoose.model('Classe',classeSchema)


module.exports=Classe