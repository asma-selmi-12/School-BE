const express = require("express");
const router = express.Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const Cour=require('../models/cours');
const Note=require('../models/notes')
const Classe=require('../models/classes')
const { all } = require("./classes");
const mongoose=require('mongoose')

const MIME_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "application/pdf": "pdf",
};

const storage = multer.diskStorage({
  // destination
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE[file.mimetype];
    let error = new Error("Mime type is invalid");
    if (isValid) {
      error = null;
    }
    cb(null, "uplods");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const extension = MIME_TYPE[file.mimetype];
    const filName = name + "-" + Date.now() + "-crococoder-" + "." + extension;
    cb(null, filName);
  },
});

// traitement logique add User
router.post(
  "/create",
  multer({ storage: storage }).fields([
    { name: "cv", maxCount: 1 },
    { name: "img", maxCount: 1 },
  ]),
  async (req, res) => {
    console.log("here into add user", req.body);
    console.log("req.file", req.files);

    const user = await User.findOne({
      $or: [{ email: req.body.email }, { tel: req.body.tel }],
    });
    if (user) {
      return res.json({
        // message: "email or tel existe",
        message:'2'
      });
    }

    const password = await bcrypt.hash(req.body.pwd, 10);

    const data = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      tel: req.body.tel,
      pwd: password,
      adresse: req.body.adresse,
      statut: req.body.statut,
      role: req.body.role,
    });

    let url = req.protocol + "://" + req.get("host");
    const role = req.body.role;
    let image;
    console.log(role);

    if (role == "student") {
      image = url + "/uplods/" + req.files.img[0].filename;
      data.img = image;
    }

    if (role == "parent") {
      console.log(req.body);
      console.log(req.body.telStudent);

      const findStudent = await User.findOne({ tel: req.body.telStudent,role: 'student' });
      console.log("phone student", findStudent);

      if (!findStudent) {
        return res.json({
          // message: "student not found",
          message: "3",
        });
      }
      data.telStudent = req.body.telStudent;
    }

    if (role == "teacher") {
      image = url + "/uplods/" + req.files.img[0].filename;
      let cvUrl = url + "/uplods/" + req.files.cv[0].filename;
      data.img = image;
      data.cv = cvUrl;
      data.specialite = req.body.specialite;
    }

    data.save((error, doc) => {
      if (error) {
        console.log(error);
        return res.json({
          message: "0",
        });
      }

      res.json({
        message: "1",
      });
    });
  }
);





// traitement logique get All students
router.get("/getAllStudent", (req, res) => {
  console.log("here into get all Students");
  console.log("bbb");

  User.find({ role: "student" }).then((docs) => {
    

    res.json({
      data: docs,
    });
  });
});

// traitement logique get All Teachers
router.get("/getAllTeachers", (req, res) => {
  console.log("here into get all Teachers");
  console.log("bbb");

  User.find({ role: "teacher" }).then((docs) => {
    console.log(docs);

    res.json({
      data: docs,
    });
  });
});






// traitement logique get All Parents
router.get("/getAllParents", (req, res) => {
  console.log("here into get all Parents");
  console.log("bbb");

  User.find({ role: "parent" }).then(async(parents) => {
   
    const result=await Promise.all(parents.map(async(parent)=>{

    const student= await User.findOne({tel:parent.telStudent,role:'student'})

    return {

      parentfirstName:parent.firstName,
      parentlastname:parent.lastName,
      parentemail:parent.email,
      parentadresse:parent.adresse,
      parentTel:parent.tel,
      parenttudentFirstName:student?.firstName,
      parentStudentLastName:student?.lastName
    }

    })) 



    res.json({
      data:result ,
    });
  });
});







// traitement logique of login
router.post("/login", async (req, res) => {
  console.log("here into login");

  const findUser = await User.findOne({ tel: req.body.tel });

  if (!findUser) {
    return res.json({
      // message: "tel not found",
      message: "0",
    });
  }

  console.log(findUser);

  const test = await bcrypt.compare(req.body.pwd, findUser.pwd);

  if (!test) {
    return res.json({
      // message: "pwd not found",
      message: "1",
    });
  }

  if (findUser.role === "teacher" && findUser.statut === false) {
    console.log("hello");

    return res.json({
      // message: "waitting :statut false",
      message: "2",
    });
  }

 const token= jwt.sign({userName:`${findUser.firstName} ${findUser.lastName}`, idUser:findUser._id ,role:findUser.role}, 'MySchool', { expiresIn: 60 * 60 });

  return res.json({
    // message: "email && pwd valid",
    message: "3",
    data: token
  });

  //    User.findOne({tel:req.body.tel}).then((findUser)=>{
  //     if (!findUser) {
  //         return res.json({
  //             message:'tel not found'
  //         })
  //     }
  //   console.log(findUser);

  //      bcrypt.compare(req.body.pwd, findUser.pwd).then((test)=>{
  //         if (!test) {
  //             return res.json({
  //                 message:'pwd not found'
  //             })
  //         }
  //      });

  //     if ((findUser.role==='teacher')&&(findUser.statut===false) ){
  //         console.log("hello");

  //             return res.json({
  //                 message:"waitting"
  //             })

  //     }

  //     return res.json({
  //         message:'email && pwd valid',
  //         data:findUser
  //     })

  //    })
});






// traitement logique get user by id
router.get('/getUserByid/:id',(req,res)=>{
    console.log('here into get user by id',req.params.id);

    const id=req.params.id
    if (!mongoose.isValidObjectId(id)) {
      return res.json({
        message:'0'
      })
    }

    User.findOne({_id:id}).then((findUser)=>{
        res.json({
            data:findUser
        })
    })
})



router.put('/updateTeacher/:statut',async(req,res)=>{
    console.log('here into update teacher',req.body);

// convertir req.params.statut en boolean 
  let newStatut=req.params.statut=== 'true' 
  console.log(typeof newStatut);
 
  console.log('req.body.statut',req.body.statut);
  
   console.log('new statut',newStatut);
   
    const data=new User({
        _id:req.body._id,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        tel:req.body.tel,
        pwd:req.body.pwd,
        adresse:req.body.adresse,
        statut:newStatut,
        role:req.body.role,
        img:req.body.img,
        cv:req.body.cv,
        specialite:req.body.specialite
    })
console.log('new data', data);

    User.updateOne({_id:req.body._id},data).then(()=>{

        res.json({
            message:'teacher updated'
        })
    })
})




router.delete('/deletUser/:id',async(req,res)=>{
    console.log('here into delete user',req.params.id);

     const id=req.params.id
        if (!mongoose.isValidObjectId(id)) {
           return res.json({
            message:'0'
           }) 
        }
 
   const findUser= await User.findOne({_id:req.params.id})

   if (findUser.role==='teacher') {
      await Cour.deleteMany({idTeacher:req.params.id})
    
   }else if (findUser.role==='student') {
    const findParent= await User.findOne({telStudent:findUser.tel})
    if (findParent) {
       await User.deleteOne({_id:findParent._id})
    }
   
   
     await Note.deleteMany({idStudent:req.params.id})
     await Classe.updateMany({students:id},{$pull: { students: id }}
      )
   }

  
   await User.deleteOne({_id:req.params.id})
   res.json({
    message:'user deleted'
})
})





// traitement logique get student by tel
router.get('/getStudentByTel/:tel',(req,res)=>{
  console.log('here into get student by tel');


  User.findOne({tel:req.params.tel}).then((doc)=>{

    if (!doc) {
      return res.json({
        message:'tel invalid'
      })
    }
    
    res.json({
      data:doc
    })

  })

  
})





// traitement get teachers by Speciality
router.get('/getTeacherBySpeciality/:speciality',(req,res)=>{
  console.log('here into get teachers by speciality');

  User.find({specialite:req.params.speciality}).then((docs)=>{
    if (!docs) {
      return res.json({message:'not found'})
    }

    res.json({
      data:docs
    })

  })
  
})




// traitement logique get profile teacher
router.get('/getProfileTeacher',(req,res)=>{
  console.log('here into profile teacher');

  User.find({role:'teacher'}).sort({'date': -1}).limit(4).then((docs)=>{
    console.log(docs);
    
    res.json({
      data:docs
    })
  })
  
})

module.exports = router;
