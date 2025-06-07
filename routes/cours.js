const express = require("express");
const router=express.Router()
const Cour=require('../models/cours')
const Classe=require('../models/classes')
const Note=require('../models/notes')
const mongoose=require('mongoose')


router.post('/addCours',(req,res)=>{
    console.log('here into add cours',req.body);
    const data=new Cour({
        name:req.body.name,
        description:req.body.description,
        durer:req.body.durer,

        // startTime:req.body.startTime,
        // endTime:req.body.endTime,
        idTeacher:req.body.idTeacher
    })

    data.save((error,doc)=>{
        console.log(error);
       if (error) {
        return res.json({
            message:'0'
        })
       }



        res.json({
            // message:'cours added'
            message:'1'
        })
        
    })

    
    
})


// traitement logique get all cours
router.get('/getAllCour',(req,res)=>{
    console.log(('here into get all cours'));
    Cour.find().populate('idTeacher').then((docs)=>{
        res.json({
            data:docs
        })
    })
})




// get all cours by id teacher
router.get('/getAllCourByIdTeacher/:id',(req,res)=>{
    console.log('here into get all cour by id teacher');

    const id=req.params.id

    if (!mongoose.isValidObjectId(id)) {
       return res.json({
           message:'0'
       })
    }
    
Cour.find({ idTeacher:id}).then((docs)=>{

    res.json({
        data:docs
    })
})   

})




// traitement logique delete cour
router.delete('/deleteCour/:id',async(req,res)=>{
    console.log('here into delete cour');
    const id=req.params.id

     if (!mongoose.isValidObjectId(id)) {
        return res.json({
            message:'0'
        })
     }

    
    await Classe.deleteMany({idCour:id})   
    await Note.deleteMany({idCour:id}) 

    Cour.deleteOne({_id:req.params.id}).then((doc)=>{

        res.json({
            message:'1'
        })
    })
    
})


// traitement logique get cour by id cour
router.get('/getCourById/:id',(req,res)=>{
    console.log('here into get cour by id');

    const id=req.params.id
    if (!mongoose.isValidObjectId(id)) {
       return res.json({
        message:'0'
       }) 
    }

    Cour.findOne({_id:id}).then((doc)=>{
        res.json({
            data:doc
        })
    })
    
})




// traitement logique update cour
router.put('/updateCours',(req,res)=>{
    console.log('here into update cours',req.body);

    const data=new Cour({
        _id:req.body._id,
        name:req.body.name,
        description:req.body.description,
        durer:req.body.durer,
        idTeacher:req.body.idTeacher
    })
    console.log(data);
    
    Cour.updateOne({_id:req.body._id},data).then(()=>{
        res.json({
            message:'0'
            // message:'cour updated'
        })
    })
})




// get cours for home
router.get('/getCoursForHome',(req,res)=>{
    console.log('here into get cours for home');

    Cour.find().populate('idTeacher').sort({'date': -1}).limit(6).then((docs)=>{
        console.log(docs);
        
        res.json({
            data:docs
        })
    })
    
})



module.exports=router