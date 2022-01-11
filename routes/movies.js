const express = require('express');
const router = express.Router();
const Movie = require('../model/movie');
const Director = require('../model/director');
const { redirect } = require('express/lib/response');
//const fs = require('fs');
//const path = require('path'); //path is an builtin node.js library
//const uploadPath = path.join('public',Movie.posterImageBasePath); // join path of  public folder with posterImageBasePath
//const multer = require('multer');//multer is like body parser of files
 const imageMimeTypes = ['image/jpeg','image/png','image/gif']//these are some default mime types used for images
// const upload = multer({
//     dest: uploadPath,
//     //destination were the file should be stored
//    fileFilter : (req,file,callback)=> {
//             callback(null,imageMimeTypes.includes(file.mimetype))
//    }
// })

//****important *******
// "We no longer need the multer coz filepond will convert the image into json string"

//all Movie route
router.get("/",async (req,res)=>{
  const searchOption = {};
    if(req.query.title != null && req.query.title !== '' ){
        searchOption.name = new RegExp(req.query.title,'i');
     
    }
    if(req.query.releaseDate != null && req.query.releaseDate !== '' ){
      searchOption.releaseDate = req.query.releaseDate;
   
    }
  
    try{
             const movie = await Movie.find(searchOption);
             res.render("movies/index",{movies : movie,searchOption:req.query});
    }catch{
           res.redirect('/');
    }
  
})

//new Movie route
router.get("/new",async (req,res)=>{
 
  renderNewPage(res,new Movie());

})

//Add New Movie 
router.post("/"  , async (req,res)=>{
    // upload.single("poster") this simply means multer we uploading a single file of name poster =>
    // "poster" name in input form

  //const fileName = req.file != null ? req.file.filename : null ;

  const movie = new Movie({
    name: req.body.name,
    director:req.body.director,
    releaseDate: new Date(req.body.releaseDate),
    duration:req.body.duration,
   // posterImageName:fileName,
    description:req.body.description
  })
  savePoster(movie,req.body.poster);
  //console.log(movie);
 // console.log(movie)
  try{
        const newMovie = await movie.save();
          res.redirect(`movies/${newMovies.id}`);
         
  }catch(err){
      console.log(err)
     // console.log(movie.posterImageName);
      // if(movie.posterImageName != null){
      //   removeMoviePoster(movie.posterImageName);
      // }
      renderNewPage(res,movie,true)
   // fs.unlink();
  }
})

// function removeMoviePoster(posterName){

//   fs.unlink(path.join(uploadPath,posterName ), err => {
//     if(err) console.error(err)
//   })
// } " we no longer need this we storing image as string not as file "

async function renderNewPage(res,movie,hasError = false){
  try{
    const director = await Director.find({});
    const params ={ directors : director,movie : movie}
    if(hasError){
      params.errorMessage = 'Error Creating Book' //like this you can add new keys to the existing object
    }
    res.render('movies/new',params)

      }catch{
    res.redirect('movies')
}

}

function savePoster(movie, posterEncoded){
 if (posterEncoded == null) return
 const poster = JSON.parse(posterEncoded); //parsing json string to json obj
 if (poster != null && imageMimeTypes.includes(poster.type)){
    movie.posterImage = new Buffer.from(poster.data,'base64');
    movie.posterImageType = poster.type;
 }
}

// Show Movie route
router.get('/:id',async (req,res) => {
  try{
   // console.log(req.params.id)
       const movie = await Movie.findById(req.params.id).populate('director').exec();
      
       //populate() gets the value associated with director which is reference to another document
      res.render('movies/show',{movie : movie})

  }
  catch{
    res.redirect('/')
  }
})


// Edit Movie route
router.get("/:id/edit",async (req,res)=>{
 try{
     const movie = await Movie.findById(req.params.id);
     renderEditPage(res,movie)
 }
 catch{
           res.redirect('/')
 }

})

async function renderEditPage(res,movie,hasError = false){
  try{
    const director = await Director.find({});
    const params ={ directors : director,movie : movie}
    if(hasError){
      params.errorMessage = 'Error Creating Book' //like this you can add new keys to the existing object
    }
    res.render('movies/edit',params)

      }catch{
    res.redirect('movies')
}
}

router.put("/:id"  , async (req,res)=>{
  
let movie

try{
      movie = await Movie.findById(req.params.id);
      
    movie.name= req.body.name;
    movie.director=req.body.director;
    movie.releaseDate= new Date(req.body.releaseDate);
    movie.duration=req.body.duration;
    movie.description=req.body.description;

    if(req.body.poster != null && req.body.poster !== ''){
      savePoster(movie,req.body.poster)
    }
    await movie.save()
    res.redirect(`/movies/${movie.id}`);
       
}catch(err){
  console.log(err)
    if(movie != null){
      renderEditPage(res,movie,true)
    }else{
      redirect('/')
    }

}
})

router.delete('/:id',async(req,res) => {
  let movie
  try{
      movie = await Movie.findById(req.params.id)  ;
      await movie.remove();
      res.redirect('/movies')
    
  }catch{
    if(movie != null){
      res.render('movies/show',{movie : movie,errorMessage : 'Could not remove Movie'})
    }else{
      res.redirect('/')
    }
  }
})
module.exports = router;