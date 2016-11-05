var path = require('path');
var base64 = require('./base64util')
//var db = require(__dirname + '/../config/db');
// var mongoose = require('mongoose');

module.exports = function(app) {
    // Server Routes ==================
    /**
     * Uploads a photo to a cart.
     * The photo should be a base64-encoded string in the body of
     * the request
     */
    app.post('/api/:cartId/:photoId', function(req, res) {
        //asdf
    });

    /**
     * Uploads a photo with no cart assignment
     */
    app.post('/api/photos/', function(req, res) {
      console.log(req.body);
      //TODO: decoding goes here, save to test maybe
      res.send('You sent a photo with body string: ' + req.body).status(200).end();
    });

    // Frontend Routes ===============
    /**
     * Displays all photos taken ever
     */
    app.get('/api/photos/', function(req, res) {
      res.send('There will be photos here.').status(200).end();
    });

    /**
     * Displays all photos for a particular cart
     */
    app.get('/api/:cartId/photos', function(req, res) {
      //TODO
    });

    /**
     * Home page
     */
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'));
    });
}
