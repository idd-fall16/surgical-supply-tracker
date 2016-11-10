var path = require('path');

// Set up file-saving middleware
var multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '.jpg');
  }
});
var upload = multer({ storage: storage });

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
    app.post('/api/photos/', upload.single('devicePicture'), function(req, res) {
        // TODO: upload DB (or maybe just directory)
      if (!req.body) {
        res.err('Error: no req body for saving image.').status(400).end();
      } else {
        res.send('Saved an image.').status(200).end();
      }
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
     * Returns a list of all scanned items.
     */
    app.get('/api/items/', function(req, res) {
      res.send('A json of strings will be here.').status(200).end();
    });

    /**
     * Home page
     */
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'));
    });
}
