const express = require("express");
const router = express.Router();
const Classe = require("../models/classes");
const mongoose = require("mongoose");
const Note=require('../models/notes');
const { path } = require("../app");

// traitement logique Add Classe
router.post("/addClasse", (req, res) => {
  console.log("here into add classe",req.body);
  

  const data = new Classe({
    name: req.body.name,
    
    students:req.body.selectedStudents, 
    idCour: req.body.cour,
  });

  data.save((error, doc) => {
    if (error) {
      console.log(error);
      return res.json({
        // message: "invalid",
        message:'0'
      });
    }

    res.json({
      // message: "classe added",
      message:'1'
    });
  });
});




// traitement logique get classe by id cour
router.get('/getClsseByIdCour/:id',(req,res)=>{
  console.log('here into get classe by id cour',req.params.id);

   const id=req.params.id
      if (!mongoose.isValidObjectId(id)) {
         return res.json({
          message:'0'
         }) 
      }

  Classe.findOne({idCour:id}).populate('idCour').populate('students').then((doc)=>{
    console.log('student of classe');
    
    res.json({
      data:doc
    })
  })
  
})



// traitement logique get classe by id student
router.get('/getClsseByIdStudent/:id',(req,res)=>{
  console.log('here into get classe by id student');
  console.log(req.params.id);

  const id =req.params.id
  if (!mongoose.isValidObjectId(id)) {
    return res.json({
      message:'0'
    })
  }

  Classe.find({students:req.params.id}).populate({
    path:'idCour',
    populate:({
      path:'idTeacher',
      select:'firstName lastName'
    })

  }).then((docs)=>{
    res.json({
      data:docs
      
      
    })
   
  })
  
})




// get all classes of teacher
router.get('/getClassesByIdTeacher/:id',async(req,res)=>{
  console.log('here into get all classes of teacher',req.params.id);
const idTeacher=req.params.id

      if (!mongoose.isValidObjectId(idTeacher)) {
         return res.json({
          message:'0'
         }) 
      }
const classes=await Classe.find().populate('students').populate({
  path:'idCour',
          
  match:{idTeacher:idTeacher}
})
console.log(classes);
const classesFilter=classes.filter((classes=>classes.idCour!=null))
console.log('classes filter',classesFilter);
if (classesFilter.length===0) {
  return res.json({
    message:'2'
  })
}

return res.json({
  data:classesFilter,
  message:'1'
})


  
})





// get all classes
router.get('/getAllClasses',(req,res)=>{
  console.log('here into get all classes');

Classe.find().populate('students').populate({
  path:'idCour',
  populate:({
  path:'idTeacher',
  select:'firstName lastName'
})

}).then((docs)=>

res.json({
  data:docs
})
)


  // Classe.find().populate('students').populate('idCour').then((docs)=>{
  //   res.json({
  //     data:docs
  //   })
  // })
  
})





// traitement logique delete classe
router.delete('/deleteClasse/:id',(req,res)=>{
  console.log('here into delete classe');

  const id =req.params.id
  if (!mongoose.isValidObjectId(id)) {
    return res.json({
      message:'0'
    })
  }

  Classe.deleteOne({_id:id}).then(()=>{
    res.json({
      message:'1'
    })
  })

})




// get classe by id classe
router.get('/getClasseByIdClasse/:id',(req,res)=>{
  console.log('here into get classe by id classe****');

  const id=req.params.id

  if (!mongoose.isValidObjectId(id)) {
  return  res.json({
      message:'0'})
  }
  
Classe.findOne({_id:id}).then((doc)=>{
  console.log('///get classe///',doc);
  
  res.json({
    message:'1',
    data:doc
  })
})

})



// traitement logique update classe
router.put('/update',(req,res)=>{
  console.log('here into get update classe',req.body);
 
 const data=new Classe({
_id:req.body._id,
name:req.body.name,
students:req.body.selectedStudents,

idCour:req.body.cour
 })
 
 Classe.updateOne({_id:req.body._id},data).then(()=>{
  res.json({
    message:'1'
  })
 })
})



// get all student of classe with their notes by id cour
router.get('/getStudentsByIdCour/:id',async(req,res)=>{
  console.log('get student with notes of classe');
  const id=req.params.id
 
 if (!mongoose.isValidObjectId(id)) {
       return res.json({
        message:'0'
       }) 
    }
  const doc=await Classe.findOne({idCour:id}).populate('students').populate('idCour')
  console.log('classe of this cour',doc);
  
  if (!doc) {
    return res.json({message:'1'})
  }

  const result= await Promise.all (doc.students.map(async(student)=>{
    const note=await Note.findOne({idCour:id,idStudent:student._id})
    return {
      id:student._id,
      firstName:student.firstName,
      lastName:student.lastName,
      email:student.email,
      note:note? note.note:null,
      idCour:id,
      tel:student.tel
    }
  })) 
  console.log('result of get student with note',result);
  res.json({
    data:result,
    message:'2'
  })
  
})
module.exports = router;


