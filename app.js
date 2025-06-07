const express= require('express')
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const path = require('path')




mongoose.connect('mongodb://127.0.0.1:27017/MySchool',{
    useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(" MongoDB CONNECTÉ"))
.catch(err => console.error(" Erreur de connexion MongoDB :", err));
;
// creation application express
const app=express() 
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Security configuration
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-with, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, OPTIONS, PATCH, PUT"
  );

  next();
});

app.use('/uplods', express.static(path.join('./uplods')))



const coursRouter=require('./routes/cours')
const userRouter=require('./routes/users')
const classeRouter=require('./routes/classes')
 const noteRouter=require('./routes/notes')




app.use('/api/users',userRouter)
app.use('/api/cours',coursRouter)
app.use('/api/classes',classeRouter)
app.use('/api/notes',noteRouter)



module.exports=app