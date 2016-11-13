var path = require('path');
var fs = require('fs');

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
let imagePath = 'uploads/devicePicture.jpg';

// Vision api
var vision = require('@google-cloud/vision')({
    projectId: 'surgitrack',
    keyFilename: 'keyfile.json'
});

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
        vision.detectText(imagePath, function(err, text, apiResponse) {
          if (err) {
            res.err(err).status(400).end();
          } else {
            console.log(text);
            res.send(text).status(200).end();
          }
        });
      }
    });

    // Frontend Routes ===============
    /**
     * Displays all photos taken ever
     */

    app.get('/api', function(req, res){
       res.json({ message: 'Api for Surgiscan' });
    })

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
     * Returns a list of all scanned items across all cases.
     */
    app.get('/api/labels/', function(req, res) {
      res.send('A json of strings will be here.').status(200).end();
    });

    /**
     * Returns a list of all scanned items for a particular case.
     */
    app.get('/api/cases/:caseID', function(req, res) {
      //TODO: unfake data
      fs.readFile('dummyData.json', function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          var json = JSON.parse(data.toString());
          res.status(200).json(json);
        }
      });
    });

    /**
     * Home page
     */
     app.get('/index', function (req, res) {
         res.sendFile(path.join(__dirname + '/public/index.html'));
     });

    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname + '/public/yo.html'));
    });
}
