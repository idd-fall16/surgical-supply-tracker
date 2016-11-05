// modules =================================================
var express        = require('express');
var app            = express();
//var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
//var methodOverride = require('method-override');

// configuration ===========================================

// config files
//var db = require('./config/db');

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
