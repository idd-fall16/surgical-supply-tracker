var path = require('path');
//var db = require(__dirname + '/../config/db');
// var mongoose = require('mongoose');

module.exports = function(app) {
    // Server Routes ==================
    // app.get('/devices', function(req, res) {
    //     Device.find(function(err, devices) {
    //         if (err) res.send(err);
    //         res.json(devices);
    //         res.status(200).end();
    //     });
    // });

    // Frontend Routes ===============
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname + '/public/index.html'));
    });
}
