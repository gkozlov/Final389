var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var fs = require('fs');
var mongoose = require('mongoose');
mongoose.Promise=global.Promise;
var dotenv = require('dotenv');
var dataS = require('./data_schema');
var closestController = require("./closestController");
// extra npm packages
var _ = require("lodash");
var makeRandom = require("make-random");
var app = express();
// web sockets
var http = require('http').Server(app);
var io = require('socket.io')(http);


dotenv.config();
console.log(process.env.MONGODB); 
mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main', partialsDir: "views/partials/" }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

app.get('/',function(req,res){
  dataS.find({}, function (err, dest) {
        if (err) throw err;

        res.render("home", {
            data : dest
        });
    });
});

app.get("/api/getDestinations", function(req, res) {
  dataS.find({}, function(err, city) {
        if (err) throw err;
        res.json(city);
    });
});

app.get("/closest", function(req, res) {
  makeRandom.randomInRange(1001, 1002).then(resp => {
    const rng = resp;
    dataS.find({},function(err,city){
        if(err) throw err;
    
        var obj = []
        
        for(var i = 0; i < city.length; i++) {
            var num = closestController.findClosest(city[i].distance);
            if (num < rng) {
                obj.push(city[i]);
            }
        }
    
        res.render('home', {
            data: obj
        });
      }); 
  });
});


app.get("/least", function(req, res) {
    var temp = Number.MAX_SAFE_INTEGER;
    dataS.find({},function(err,city){
        if(err) throw err;
        
        for(var i = 0; i < city.length; i++) {
            var num = parseInt(city[i].visitors)
            if (num < temp) {
                temp = num;
            }
        }
        var dest =[];
        for(var i = 0; i < city.length; i++) {
            var num1 = parseInt(city[i].visitors)
            if (num1 == temp) {
                dest.push(city[i]);
            }
        }
        res.render('home', {
            data: dest

        });
    }); 
});

app.get("/far", function(req, res) {
	var temp = -1;
    dataS.find({},function(err,city){
        if(err) throw err;
    
        var obj = []
        
        for(var i = 0; i < city.length; i++) {
            var num = closestController.findClosest(city[i].distance);
            if (num > temp) {
                temp = num;
            }
        }
        _.each(city, function(c) {
            var pn = closestController.findClosest(c.distance);
            if (pn== temp) {
                obj.push(c);
            }
        });

    
        res.render('home', {
            data: obj
        });
      });
});

app.get("/most", function(req, res) {
    var temp = -1;
  dataS.find({},function(err,city){
    if(err) throw err;

    var obj = [];

    _.each(city, function(c) {
        num = c.tags.length;
        if(num > temp){
            temp = num;
         }
    });

    _.each(city, function(c) {
        if (c.tags.length == temp) {
            obj.push(c);
        }
    });

    res.render('home', {
        data: obj
    });
  });
});

app.get("/alphabetical", function(req, res) {
    var options = {
        city: 1
    };

    dataS.find({}, function(err, result) {
	    res.render('home', {
            data: result
        });
    })
    .sort(options);
});

app.get("/create", function(req, res) {
    res.render('create');
});

app.post('/api/create', function(req, res) {
    if(!req.body) { return res.send("No data recieved"); }
    
    var tagsArr = req.body.tags.split(",");
    var tagsObjArr = [];

    for (var i = 0; i < tagsArr.length; i++) {
        tagsObjArr.push({
            amenity: tagsArr[i]
        });
    }
    
    var dest = new dataS({
        city: req.body.city,
        country: req.body.country,
        distance: req.body.distance,
        visitors: parseInt(req.body.visitors),
        tags: tagsObjArr
    });

    // Save dest to database
    dest.save(function(err) {
        if (err) throw err;
        // return res.send('Succesfully inserted a destination.');
        io.emit('new dest', dest);
        return res.redirect("/");
    });
});

app.post('/dest/:city/:tags', function(req, res) {
    dataS.findOne({ city: req.params.city },function(err,city){
        if (err) throw err;
        if (!city) return res.send('No destination found with that ID.');

        city.tags.push({
            amenity: req.params.tags
        });

        city.save(function(err) {
            if (err) throw err;
            res.send('Sucessfully added a tag.');
        });

    });
});

app.delete('/city/:id', function(req, res) {
    dataS.deleteOne({city: req.params.id}, function(err, city) {
        if (err) throw err;

        if(!city){return res.send('No destination with that id');}
        res.send('Destination deleted!');
    });
});

app.delete('/country/:id', function(req, res) {
    dataS.deleteOne({country: req.params.id}, function(err, city) {
        if (err) throw err;

        if(!city){return res.send('No destination with that id');}
        res.send('Destination deleted!');
    });
});

app.get('/description', function(req, res) {
    res.render('description');
});

io.on('connection', function(socket) {
    console.log('NEW connection');
    socket.on('new dest', function(dest) {
        io.emit('new dest', dest);
    })
    
    socket.on('disconnect', function() {
        console.log('User has disconnected');
    });
});
http.listen(process.env.PORT || 3000, function() {
    console.log('Listening!');
});
// http.listen(3000, function() {
//     console.log('Listening on port 3000!');
// });