var         express = require("express"),                   // web development framework
            mustacheExpress = require('mustache-express');  // Logic-less {{mustache}} templates
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

app.engine('html', mustacheExpress());          // register file extension mustache
app.set('view engine', 'html');                 // register file extension for partials
app.set('views', __dirname + '/html');
app.use(express.static(__dirname + '/public')); // set static folder
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// app.get('/', function(req, res) {
//     res.render('master', {
//             head: {
//                   title: 'page title'

//             },
//             content: {
//                   title: 'post title',

//                   description: 'description'
//             } 
//         });
//     });

app.get('/', function(req, res) {
  var date = req.query.date
  MongoClient.connect('mongodb://localhost:27017', function(err, db) {
    if (err) {
      console.log(err);
      throw err;
    }
    var database = db.db('demo')
    database.collection('detection').findOne({"date": date}, null, function(err, result) {
      res.render('index', result.detection[0]);
      console.log(result.detection[0]);
    });
  });
});

app.post('/', function(req, res) {
  console.log(req.body.detection[0]);
  MongoClient.connect('mongodb://localhost:27017', function(err, db) {
    if (err) {
      console.log(err);
      throw err;
    }
    var database = db.db('demo')
    var date = req.body.date
    console.log(date)
    database.collection('detection').updateOne({date: date}, {$set: req.body}, {upsert: true, w: 1}, function(err, result) {
      console.log(err)
      res.send('OK');
    });
  });
});

app.listen(process.env.PORT || 3000);
