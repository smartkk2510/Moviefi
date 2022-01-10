const mongoose = require('mongoose');
const Movies = require('./movie');

const directorSchema = mongoose.Schema(
    {
        name:{
            type : String,
            required: true,
            minlength: 2
        }
    }
)

directorSchema.pre('remove',function(next){
Movies.find({ director : this.id},(err,movies) => {
    if(err){
        next(err)
    }else if((movies.length > 0)){
        next(new Error('This director has movies still'))
    }else{
        next()
    }
})
})
//pre takes place before the speciied action happens.here action is "remove"
module.exports = mongoose.model("Director",directorSchema)