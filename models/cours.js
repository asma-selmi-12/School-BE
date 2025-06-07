const mongoose = require('mongoose');



const coursSchema=mongoose.Schema({

    name:{type:String,trim:true,required:true},
    description:{type:String,required:true},
    durer:{type:String,required:true},

    // startTime:{type:String,required:true},
    // endTime:{type:String,required:true},
    idTeacher:{type:String,required:true,ref:'User'}

},
{timestamps:true}
)


const Cour=mongoose.model('Cour',coursSchema)


module.exports=Cour