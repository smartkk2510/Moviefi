//here routes => Controller in MVC architecture
const express = require('express');
const router = express.Router();
const Movies = require('../model/movie');
router.get("/",async (req,res)=>{
    let movie;
    try{
        movie = await Movies.find().sort({  uploadedAt : 'desc'}).limit(10).exec()
        res.render("index",{movies : movie});
    }
    catch{
              book = [];
    }
  
})
module.exports = router;