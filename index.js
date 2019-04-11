var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var dataUtil = require("./data-util");
var _ = require("underscore");
var moment = require('moment');
var marked = require('marked'); // allows parsing markdown language
const multer = require('multer'); // use for saving images
var upload = multer({ dest: 'public' })

var app = express();
var PORT = 3000;


var _DATA = dataUtil.loadData().podcasts; // _DATA will act as a Database


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5
 * endpoints for the API, and 5 others.
 */

app.get('/',function(req,res){

    res.render('home',{ //first arguemnt is which file to open, second argument is data passing
        data: _DATA,
        helpers: {
            getAverage: function (ratings) {
                var sum, avg = 0;
                if (ratings == null){
                    return "Add below"
                }else if(ratings.length === 1){
                    return ratings[0]
                }else{
                    sum = ratings.reduce(function (a, b) {
                        return a + b;
                    });
                    avg = sum / ratings.length;

                    return Math.round(avg* 10) / 10;
                }

            }
        }
    });
});
app.get("/addNewPodcast", function(req, res) {
    res.render('addNewPodcast');
});
app.post('/addNewPodcast', function(req, res) {
    var body = req.body;

    // Transform tags and content
    body.tags = body.tags.split(" ");
    body.content = marked(body.content);

    // Add time and preview
    body.preview = body.content.substring(0, 300);
    //Wed Apr 10 2019 15:05:54 GMT-0400 (Eastern Daylight Time) {}

    body.time = moment().format('MMMM Do YYYY, h:mm a');


    // Save new blog post
    _DATA.push(req.body);
    dataUtil.saveData(_DATA);
    res.redirect("/");
});
app.post("/create",upload.single('image'), function(req, res) {
    var body = req.body;
    // Transform content
    body.description = marked(body.description);

    if(req.file) body.image = req.file.filename; // filename is this blogs associated image
    body.ratings = [parseFloat(body.rating)];

    body.time = moment().format();
    console.log("DATE BELOW")
    console.log(body.time)
    console.log(new Date())

    // Save new blog post
    _DATA.push(req.body);
    dataUtil.saveData(_DATA);
    res.redirect("/");
});

app.post('/addRating/:podcastName',function(req, res) {
    var newRating = req.body.newRating.toString();

    var podcast = _.findWhere(_DATA, { title: req.params.podcastName });
    if(!podcast.ratings) podcast.ratings = [parseInt(newRating)];
    else podcast.ratings.push(parseInt(newRating));

    // Save new Rating
    dataUtil.saveData(_DATA);
    res.redirect("/");
});

app.get('/post/:podcastName', function(req, res) {
    var podcast = _.findWhere(_DATA, { readFull: req.params.podcastName });
    if (!podcast) return res.render('404');
    res.render('addRating', podcast);
});

app.get('/getPodcasts', function(req, res) {
    res.json(_DATA);
});

//
app.get("/highestRated", function(req, res) {
    res.render('highestRated',{ //first argument is which file to open, second argument is data passing
        data: _DATA,
        helpers: {
            getAverage: function (ratings) {
                var sum, avg = 0;
                if (ratings == null){
                    return "Add below"
                }else if(ratings.length === 1){
                    return ratings[0]
                }else{
                    var total=ratings.map(function(n){
                        return n*100;
                    }).reduce(function(a, b){
                        return a+(b || 0);
                    });

                    return Math.round((total/ratings.length))/100;
                }

            },
            ratingIsOverFour: function (ratings) {
                var average;
                if (ratings == null){
                    return false
                } else{
                    var total=ratings.map(function(n){
                        return n*100;
                    }).reduce(function(a, b){
                        return a+(b || 0);
                    });

                    average = Math.round((total/ratings.length))/100;
                }

                if(average >= 4) return true;
                return false;
            }
        }
    });
});
app.get("/lowestRated", function(req, res) {
    res.render('lowestRated',{ //first argument is which file to open, second argument is data passing
        data: _DATA,
        helpers: {
            getAverage: function (ratings) {
                var sum, avg = 0;
                if (ratings == null){
                    return "Add below"
                }else if(ratings.length === 1){
                    return ratings[0]
                }else{
                    var total=ratings.map(function(n){
                        return n*100;
                    }).reduce(function(a, b){
                        return a+(b || 0);
                    });

                    return Math.round((total/ratings.length))/100;
                }

            },
            ratingIsUnderTwo: function (ratings) {
                var average;
                if (ratings == null){
                    return false
                } else{
                    var total=ratings.map(function(n){
                        return n*100;
                    }).reduce(function(a, b){
                        return a+(b || 0);
                    });

                    average = Math.round((total/ratings.length))/100;
                }

                if(average <= 2) return true;
                return false;
            }
        }
    });
});
app.get('/alphabetical',function(req,res){
    function SortByTitle(x,y) {
        return ((x.title == y.title) ? 0 : ((x.title > y.title) ? 1 : -1 ));

    }
    _DATA.sort(SortByTitle);
    console.log(_DATA)
    res.render('alphabetical',{ //first arguemnt is which file to open, second argument is data passing
        data: _DATA,
        helpers: {
            getAverage: function (ratings) {
                if (ratings == null){
                    return "Add below"
                }else if(ratings.length === 1){
                    return ratings[0]
                }else{
                    var total=ratings.map(function(n){
                        return n*100;
                    }).reduce(function(a, b){
                        return a+(b || 0);
                    });

                    return Math.round((total/ratings.length))/100;
                }

            }
        }
    });
});
app.get('/justAdded',function(req,res){
    res.render('justAdded',{
        data: _DATA,
        helpers: {
            getAverage: function (ratings) {
                if (ratings == null){
                    return "Add below"
                }else if(ratings.length === 1){
                    return ratings[0]
                }else{
                    var total=ratings.map(function(n){
                        return n*100;
                    }).reduce(function(a, b){
                        return a+(b || 0);
                    });

                    return Math.round((total/ratings.length))/100;
                }
            },
            justAdded: function (dateCreated) {
                if (moment(dateCreated).add(30, 'days').isBefore(new Date())) return false;
                return true;
            }
        }
    });
});
app.get('/randomPodcast',function(req,res){
        var length = _DATA.length;
        var random = Math.floor(Math.random() * Math.floor(length));
        var newData = _DATA[random];

    res.render('randomPodcast',{
        data: newData,
        helpers: {
            getAverage: function (ratings) {
                if (ratings == null){
                    return "Add below"
                }else if(ratings.length === 1){
                    return ratings[0]
                }else{
                    var total=ratings.map(function(n){
                        return n*100;
                    }).reduce(function(a, b){
                        return a+(b || 0);
                    });

                    return Math.round((total/ratings.length))/100;
                }
            }
        }
    });
});

app.listen(process.env.PORT || 3000, function() {
    console.log('Listening!');
});
