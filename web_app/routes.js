var path = require('path');
//var db = require(__dirname + '/../config/db');
// var mongoose = require('mongoose');

module.exports = function(app) {
    // Server Routes ==================
    /**
     * Uploads a photo to a cart
     */
    app.post('/api/:cartId/:photoId', function(req, res) {
        //asdf
    });

    /**
     * Uploads a photo with no cart assignment
     */
    app.post('/api/photos/:photoId', function(req, res) {
      res.send('You sent a photo with id: ' + req.params.photoId).status(200).end();
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
