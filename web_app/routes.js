var path = require('path');
var fs = require('fs');
var pythonShell = require('python-shell')

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

// Secondary requests
var request = require('request');

module.exports = function(app, runningInCloud) {
    // Server Routes ==================
    /**
     * Creates a new case assignment. Expects a case_number as parameter passed in in the URL.
     * Expects a body JSON as follows:
     * {
        surgery_type : String,
        surgeon : String
     * }
     */
    app.post('/api/cases/', function(req, res) {
      if (!req.body) {
        res.status(400).send('Error: incorrect parameters for creating case.');
      } else {
        var newCase = new models.Case({
          // case_number: req.params.case_number,
          surgery_type: req.body.surgery_type,
          surgeon: req.body.surgeon,
          // Insert data from the preference card, which is constant for now.
          items: [
            new models.Item({
              item_name: "Safety IV Catheters - Radiopaque (Jelco)",
              donating: 0,
              total: 5,
              cost: "135.00"
            }),
            new models.Item({
              item_name: "IV Secondary Set",
              donating: 0,
              total: 2,
              cost: "5.00"
            }),
            new models.Item({
              item_name: "Shiley Tracheostomy Tube Cuffless with Disposable Inner Cannula (Covidian)",
              donating: 0,
              total: 3,
              cost: "75.21"
            }),
            new models.Item({
              item_name: "0.9% Sodium Chloride Injection USP",
              donating: 0,
              total: 20,
              cost: "135.00"
            }),
            new models.Item({
              item_name: "Swan-Ganz (Edwards Lifesciences)",
              donating: 0,
              total: 3,
              cost: "1500.00"
            }),
            new models.Item({
              item_name: "Dermacea USP Type VII Gauze (Covidien)",
              donating: 0,
              total: 10,
              cost: "3.99"
            }),
            new models.Item({
              item_name: "Transpac IV Monitoring Kit (ICU Medical)",
              donating: 0,
              total: 6,
              cost: "21.00"
            })
          ]
        });
        newCase.save(function(err) {
          if (err) {
            res.status(400).send(err);
          } else {
            if (!runningInCloud) {
              request({
                uri: 'http://surgitrack.tech/api/cases',
                method: 'POST',
                json: newCase
              }, function(err, res, body) {
                console.log('Reponse from cloud server:');
                console.log(body);
              });
            }
            res.status(200).send(newCase);
          }
        });
      }
    });

    /**
     * Creates a dummy case
     */
    app.post('/api/dummy/cases/:case_number', function(req, res) {
      fs.readFile('dummyCase.json', function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          // Extract the single case
          data = JSON.parse(data.toString()).cases[0];
          var newCase = new models.Case({
            case_number: req.params.case_number,
            surgery_type: data.surgery_type,
            surgeon: data.surgeon,
            items: data.items
          });
          newCase.save(function(err) {
            if (err) {
              res.status(400).send('Error: could not save dummy case: ' + newCase + '\n error is: ' + err);
            } else {
              res.status(200).send('Successfully created dummy case: ' + newCase);
            }
          });
        }
      });
    });

    /**
     * Uploads a photo with to CASE_ID
     */
    app.post('/api/cases/:case_number/items/photo', upload.single('devicePicture'), function(req, res) {
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
            //FIXME: how to choose best text?
            if (!text) {
              res.status(400).json({ "error" : "No text found in photo. "});
              return;
            }
            var itemName = models.Item.classifyItem(text);
            if (!itemName) {
              res.status(400).send('Error: could not classify item.');
              return;
            }

            //FIXME: DRY this up okay
            // Create new item
            var newItem = new models.Item({
              item_number: 42,
              item_name: itemName,
              donating: 1,
              total: 5,
              cost: 0
            });
            // Find case with corresponding case number
            try {
              models.Case.findOne({ case_number: req.params.case_number }, function (err, matchingCase) {
                if (err || !matchingCase || !req.params.case_number) {
                  console.log('DB error.');
                  res.status(400).send(err);
                } else if (!matchingCase) {
                  res.status(404).json({ "error" : "No matching case found."});
                } else {
                  matchingCase.addItem(newItem);
                  matchingCase.save(function(err) {
                    if (err) {
                      res.status(400).send('Error: could not save new item');
                    } else {
                      if (!runningInCloud) {
                        request({
                          uri: 'http://surgitrack.tech/api/cases/'
                                + req.params.case_number + '/items/json',
                          method: 'POST',
                          json: newItem,
                        }, function(secondaryErr, secondaryRes, secondaryBody) {
                          console.log('Reponse from cloud server:');
                          console.log(secondaryBody);
                          // Have to delay the origin response until the end
                          res.status(200).send('Added item in:\n' + matchingCase);
                        });
                      } else {
                        // Without a secondary request, just send response
                        res.status(200).send('Added item in:\n' + matchingCase);
                      }
                    }
                  });
                }
              });
            } catch(err) {
              console.log('Internal error--recovered without sending response.');
            }
          }
        });
      }
    });

    /**
     * Uploads a photo with to CASE_ID, witout photo parsing
     */
    app.post('/api/cases/:case_number/items/json', upload.single('devicePicture'), function(req, res) {
        // TODO: upload DB (or maybe just directory)
      if (!req.body) {
        res.status(400).send('Error: no req body for saving image.');
      } else {
        // Create new item
        var newItem = new models.Item({
          item_number: req.body.item_number,
          item_name: req.body.item_name,
          donating: 0,
          total: 0,
          cost: 0
        });
        // Find case with corresponding case number
        models.Case.findOne({ case_number: req.params.case_number }, function (err, matchingCase) {
          if (!req.params.case_number || !req.body) {
            res.status(400).send('Error: incorrect parameters for creating case.');
          } else if (!matchingCase) {
            res.status(404).json({ "error" : "No matching case found."});
          } else {
            matchingCase.addItem(newItem);
            matchingCase.save(function(err) {
              if (err) {
                res.status(400).send('Error: could not save new item');
              } else {
                res.status(200).send('Added item in:\n' + matchingCase);
              }
            });
          }
        });
      }
    });

    /**
     * Returns a list of costs of cases for the surgeon for the given case.
     */
    app.get('/api/cases/:case_number/costs', function(req, res) {
      models.Case.findOne({ case_number: req.params.case_number }, function(err, matchingCase) {
        if (err) {
          res.status(400).send(err);
        } else {
          var surgeon = matchingCase.surgeon;
          models.Case.aggregate([
            { '$match' : {
              surgeon : surgeon
            }},
            { '$sort' : {
              date : -1
            }},
            { '$unwind' : '$items' },
            { '$group' : {
              _id : '$date',
              total_cost : { '$sum' : {'$multiply' : ['$items.cost', '$items.donating']} }
            }}
          ], function(err, result) {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(200).send(result);
            }
          });
        }
      });
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
          res.status(200).json({ "cases" : cases });
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
     * Returns a list of DUMMY cases.
     */
    app.get('/api/dummy2/cases/', function(req, res) {
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
     * Returns a JSON containing possible surgeon, surgery type, and item values.
     */
     app.get('/api/case_values', function(req, res) {
       fs.readFile('caseTypes.json', function(err, data) {
         if (err) {
           res.status(400).send(err);
         } else {
           var json = JSON.parse(data.toString());
           res.status(200).json(json);
         }
       });
     });

    /**
     * Returns info for a case with case_number.
     */
    app.get('/api/cases/:case_number', function(req, res) {
      models.Case.findOne({ case_number: req.params.case_number }, function(err, oneCase) {
        if (err) {
          res.status(400).send(err);
        } else if (!oneCase) {
          res.status(404).json({ "error" : "No case with that number." });
        } else {
          res.status(200).json(oneCase);
        }
      });
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
    //  app.get('/cases/:caseID', function (req, res) {
    //      res.sendFile(path.join(__dirname + '/public/cases.html'));
    //  });

     app.get('/cases/:caseID', function (req, res) {
         res.sendFile(path.join(__dirname + '/public/case.html'));
     });

    //  app.get('/onboarding', function (req, res) {
    //      res.sendFile(path.join(__dirname + '/public/onboarding.html'));
    //  });

    //*****each html should include router.js as the last script.*****
    app.get('/onboarding', function(req, res) {
      res.sendFile(path.join(__dirname + '/public/onboarding.html'));
    });

    app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname + '/public/onboarding.html'));
    });

    app.get('/send_photo_buttons/:case_number', function(req, res) {
      if (runningInCloud) {
        res.status(400).send('Cannot run python script on cloud.');
        return;
      }
      pythonShell.run('/public/send_photo_buttons.py', { args: req.params.case_number }, function (err, results) {
	console.log('Opening camera for case ' + req.params.case_number);
        if (err) {
          console.log("error", err);
          res.status(400).send(err);
        } else {
          console.log("results", results);
          res.status(200).send(results);
        }
      });
    });

     app.get('/cases/:caseID/analytics', function (req, res) {
         res.sendFile(path.join(__dirname + '/public/analytics.html'));
     });

     app.get('/cases', function (req, res) {

         res.sendFile(path.join(__dirname + '/public/cases.html'));
     });
}
