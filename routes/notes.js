const express=require('express')
const router=express.Router()
const Note=require('../models/notes')
const mongoose=require('mongoose')




router.post('/addNote',(req,res)=>{
    console.log('here into add note',req.body);

    const data=new Note({
    note:req.body.note,
    evaluation:req.body.evaluation,
    idCour:req.body.idCour,
    idStudent:req.body.idStudent,

    })


data.save((error,doc)=>{
    if (error) {
    return    res.json({
            message:'invalid'
        })
    }

    res.json({
        message:'1'
    })
})
    
})




// traitemnt logique get note of student
router.get('/getNoteOfStudent/:idStudent/:id',(req,res)=>{
    console.log('get note of student');
    const idStudent=req.params.idStudent
    const idCour=req.params.id

    if (!mongoose.isValidObjectId(idStudent) || !mongoose.isValidObjectId(idCour)) {
        console.log('bbbb');
        return res.json({
            
            
            message:'0'
        })
    }

    Note.findOne({idStudent:idStudent,idCour:idCour}).populate('idCour').populate('idStudent').then((doc)=>{
       console.log(doc);
       
       if (!doc) {
        return res.json({
            message:'1'
        })
       }

        res.json({
            data:doc,
            message:'2'
        })
    })
    
})



// traitement logique update note of student
router.put('/updateNote',(req,res)=>{
    console.log('here into update note',req.body);

    const data =new Note({
        _id:req.body._id,
        note:req.body.note,
        evaluation:req.body.evaluation,
        idcour:req.body.idcour,
        idStudent:req.body.idStudent
    })

    Note.updateOne({_id:req.body._id},data).then(()=>{
        res.json({
            message:"1"
        })
    })
    
})



// traitement logique get all Notes of Students by id cour
router.get('/getNotesOfStudentsByIdCour/:id',(req,res)=>{
    console.log('here into get all notes of student by id cour',req.params.id);
    const id =req.params.id
    if (!mongoose.isValidObjectId(id)) {
        return res.json({
            message:'0'
        })
    }

    Note.find({idCour:id}).populate('idCour').populate('idStudent').then((docs)=>{
        res.json({
            data:docs
        })
    })
})





// traitement logique delete note
router.delete('/deleteNote/:idStudent/:idCour',(req,res)=>{
    console.log('here into delete note',req.params.idStudent,req.params.idCour);
    const idStudent=req.params.idStudent
    const idCour=req.params.idCour

    if (!mongoose.isValidObjectId(idStudent)|| !mongoose.isValidObjectId(idCour)) {
       return res.json({
        message:'0'
       }) 
    }


    Note.deleteOne({idStudent:idStudent,idCour:idCour}).then(()=>{
        res.json({
            message:'1'
        })
    })
    
})




module.exports=router
