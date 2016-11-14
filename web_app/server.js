// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
//var methodOverride = require('method-override');

// configuration ===========================================

// Connect to database
var url = 'mongodb://localhost:27017/';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to database.');
});


var port = process.env.PORT || 3000; // set our port
//mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// routes ==================================================
require('./routes.js')(app); // pass our application into our routes

// start app ===============================================
app.listen(port, function() {
    console.log("Running on port: " + port);
    exports = module.exports = app;
});
