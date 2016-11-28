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
  item_number: Number,
  item_name: String,
  donating: Number,
  total: Number,
  cost: Number
});

var Item = mongoose.model('Item', itemSchema);

var caseSchema = new Schema({
  case_number: { type: Number, index: true, unique: true },
  surgery_type: String,
  surgeon: String,
  items: [itemSchema]
});

// Increment the item count, or create the new item in the list if it doesn't
// already exist
caseSchema.methods.addItem = function(newItem) {
  var existingItem;
  for (var i = 0; i < this.items.length; i++) {
    existingItem = this.items[i];
    if (newItem.item_name == existingItem.item_name) {
      existingItem.donating += 1;
      return;
    }
  }
  this.items.push(newItem);
}

var Case = mongoose.model('Case', caseSchema);

// Export
module.exports = {}
module.exports.Item = Item;
module.exports.Case = Case;
