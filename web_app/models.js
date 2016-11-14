var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
  name: String,
  caseId: Number
});

var Item = mongoose.model('Item', itemSchema);

var caseSchema = new Schema({
  caseId: Number,
  type: String,
  surgeon: String,
  items: [itemSchema]
});

var Case = mongoose.model('Case', caseSchema);

//TODO: write all our nifty methods here!

// Export
module.exports = {}
module.exports.Item = Item;
// module.exports.Case = Case;
