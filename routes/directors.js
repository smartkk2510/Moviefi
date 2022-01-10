const express = require('express');
const router = express.Router();
const Directors = require('../model/director');
const mongoose = require('mongoose')
const Movies = require('../model/movie')
//all directors route
router.get("/",async (req,res)=>{
    
    const searchOption = {};
    //req.query in get method is just lke req.body in post method
    if(req.query.name != null && req.query.name !== '' ){
        searchOption.name = new RegExp(req.query.name,'i');
        //you can add keys to object like above also
    }
//     console.log(searchOption)
//  console.log(req.query)
    try{
             const directors = await Directors.find(searchOption);
             res.render("directors/index",{director:directors,searchOption:req.query});
    }catch{
           res.redirect('/');
    }
  
})

//new directors route
router.get("/new",async (req,res)=>{
    res.render("directors/new",{ director : new Directors() });//Director() i created his in model
})

//Add new director
router.post("/",async (req,res)=>{
    const newDirector = new Directors({
        name : req.body.name
    })

    try{
          
          let Director = await newDirector.save(); //newDiretor is the obj of model "director" that i created.
           res.redirect(`directors/${Director.id}`);
        //  console.log(Director)
         
    }
    catch(err)
    {  
        console.log(err)
        let locals = {errorMessage: "Error Creating Director"}
        res.render("directors/new",{director:newDirector,  locals: locals})//newDirector is an obj
    }
   
})

router.get('/:id',async (req,res)=>{
    try{
    const director = await Directors.findById(req.params.id)
    const movie = await Movies.find({director : director.id})
     res.render('directors/show',{director : director,moviesByDirector:movie}) 
    }catch{
         res.redirect('/');
    }
})

router.get('/:id/edit',async (req,res)=>{
    //nothing
    try{
        const director = await Directors.findById(req.params.id)
        res.render("directors/edit",{ director : director });

    }catch{
res.redirect('/directors');
    }
})

router.put('/:id',async (req,res)=>{
    let existingDirector ;

    try{
         existingDirector = await Directors.findById(req.params.id) 
         existingDirector.name = req.body.name;
           await existingDirector.save(); 
          res.redirect(`/directors/${existingDirector.id}`);
    }
    catch(err)
    {  
        console.log(err)
        let locals = {errorMessage: "Error Updating Director"}
        res.render("directors/edit",{director:existingDirector,  locals: locals})
    }
    
})

router.delete('/:id',async (req,res)=>{
    let existingDirector ;

    try{
      

         existingDirector = await Directors.findById(req.params.id);
  
           await existingDirector.remove(); 
          res.redirect(`/directors`);
    } catch(err)
    {  
        console.log(err)
        if( existingDirector == null) res.redirect('/');
       else res.redirect(`/directors/${existingDirector.id}`);      
    }}
)

module.exports = router;