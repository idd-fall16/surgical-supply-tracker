var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/';

// Connecting to database
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to database.');
});

// Setting up schemas
var Schema = mongoose.Schema;

var itemSchema = new Schema({
  name: String,
  caseId: Number
});

var Item = mongoose.model('Item', itemSchema);

var caseSchema = new Schema({
  caseId: Number,
  surgery_type: String,
  surgeon: String,
  items: [itemSchema]
});

var Case = mongoose.model('Case', caseSchema);

//TODO: write all our nifty methods here!

// Export
module.exports = {}
module.exports.Item = Item;
module.exports.Case = Case;
