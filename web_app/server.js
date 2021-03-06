// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var fs             = require('fs');
var assert         = require('assert');
var pythonShell    = require('python-shell');
//var methodOverride = require('method-override');

// configuration ===========================================
var port = process.env.PORT || 3000; // set our port
app.use(bodyParser.json()); // for parsing application/json
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

//Store all JS and CSS in Scripts folder.
app.use(express.static(__dirname + '/css'));

// routes ==================================================
// Is this instance running in the cloud?
var runningInCloud = false;
if (process.argv.includes('--cloud') || process.argv.includes('-c')) {
  console.log('Running app in cloud mode (no extra requests).');
  runningInCloud = true;
}
require('./routes.js')(app, runningInCloud); // pass our application into our routes

// models (pretty much just for seeding)
var models = require('./models.js');

// Stop mongoose deprecation warnings
mongoose.Promise = global.Promise;

// start app ===============================================
app.listen(port, function() {
    console.log("Running on port: " + port);
    exports = module.exports = app;

    if (process.argv.includes('--seed') || process.argv.includes('-s')) {
      console.log('Seeding database...');
      fs.readFile('dummyCases.json', function(err, data) {
        if (err) {
          console.log(err);
        } else {
          var json = JSON.parse(data.toString());
          var cases = json.cases;
          console.log('... removing all old cases ...');
          models.Case.remove(null, function(err) {
            if (err) { console.log(err); }
            else {
              models.Case.resetCount(function(err, nextCount) {});
            }
          })
          .then(models.Case.insertMany(cases, function (err, result) {
            console.log('... cases removed, now repopulating...');
            if (err) { console.log(err); }
            else {
              console.log('...complete!');
            }
          }));
        }
      });
    }
});
