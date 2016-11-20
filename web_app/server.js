// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
//var methodOverride = require('method-override');

// configuration ===========================================
var port = process.env.PORT || 3000; // set our port
app.use(bodyParser.json()); // for parsing application/json
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

//Store all JS and CSS in Scripts folder.
app.use(express.static(__dirname + '/css'));

// routes ==================================================
require('./routes.js')(app); // pass our application into our routes

// start app ===============================================
app.listen(port, function() {
    console.log("Running on port: " + port);
    exports = module.exports = app;
});
