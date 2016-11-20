var path = require('path');
var fs = require('fs');

// Import models for DB
var models = require('./models.js');

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
var imagePath = 'uploads/devicePicture.jpg';

// Vision api
var vision = require('@google-cloud/vision')({
    projectId: 'surgitrack',
    keyFilename: 'keyfile.json'
});

module.exports = function(app) {
    // Server Routes ==================
    /**
     * Creates a new case assignment
     */
    app.post('/api/cases/:caseID', function(req, res) {
      if (!req.params.caseID || !req.body) {
        res.status(400).send('Error: incorrect parameters for creating case.');
      } else {
        var newCase = new models.Case({
          caseID: req.params.caseID,
          surgery_type: req.body.surgery_type,
          surgeon: req.body.surgeon,
          items: []
        });
        newCase.save(function(err) {
          if (err) {
            res.status(400).send('Error: could not save case: ' + newCase);
          } else {
            res.status(200).send('Successfully created case: ' + newCase);
          }
        });
      }
    });

    /**
     * Uploads a photo with no to CASE_ID
     */
    app.post('/api/cases/:caseID/photos/', upload.single('devicePicture'), function(req, res) {
        // TODO: upload DB (or maybe just directory)
      if (!req.body) {
        res.status(400).send('Error: no req body for saving image.');
      } else {
        vision.detectText(imagePath, function(err, text, apiResponse) {
          if (err) {
            console.log("Error in parsing.");
            console.log(err);
            res.status(400).send(err);
          } else {
            console.log("Successful parse.");
            console.log(text);
            res.status(200).send(text);
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
    });

    /**
     * Returns a list of all cases.
     */
    app.get('/api/cases/', function(req, res) {
      models.Case.find(function(err, cases) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).json(cases);
        }
      });
    });

    /**
     * Returns a list of DUMMY cases.
     */
    app.get('/api/dummy/cases/', function(req, res) {
      fs.readFile('dummyCases.json', function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          var json = JSON.parse(data.toString());
          res.status(200).json(json);
        }
      });
    });

    /**
     * Returns info for a case with caseID.
     */
    app.get('/api/cases/:caseID', function(req, res) {

    });

    /**
     * Returns info for a dummy case.
     */
    app.get('/api/dummy/cases/:caseID', function(req, res) {
      //TODO: unfake data
      fs.readFile('dummyCase.json', function(err, data) {
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
     app.get('/cases/:caseID', function (req, res) {
         res.sendFile(path.join(__dirname + '/public/case.html'));
     });

     app.get('/onboarding', function (req, res) {
         res.sendFile(path.join(__dirname + '/public/onboarding.html'));
     });

     app.get('*', function (req, res) {
         res.send(req.params);
     });
}
