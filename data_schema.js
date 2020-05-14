var mongoose = require('mongoose'); 
mongoose.Promise = global.Promise

var amen = new mongoose.Schema({
    amenity:{
        type: String,
        required: true
    }
});

var destSchema = new mongoose.Schema({
    city:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },    
    distance:{
        type: String,
        required: true
    },
    visitors:{
        type: Number,
        required: true 
    },
    tags:[amen]
}); 

var dataS = mongoose.model('dataS', destSchema);
module.exports = dataS;