var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var url = 'mongodb://localhost:27017/';

// Connecting to database
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to database.');
});
autoIncrement.initialize(db);

// Setting up schemas
var Schema = mongoose.Schema;

var itemSchema = new Schema({
  item_name: String,
  donating: Number,
  total: Number,
  cost: Number
});

// Given a an array of text items scanned from the vision API,
// Classify the item and return a standardized title
// Returns: String which is the standardized title
// FIXME: use actual mapping to do this
itemSchema.statics.classifyItem = function(text) {
 var titles = {
   catheter : 'Safety IV Catheters - Radiopaque (Jelco)',
   tracheostomy : 'Shiley Tracheostomy Tube Cuffless with Disposable Inner Cannula (Covidian)',
   transpac : 'Transpac IV Monitoring Kit (ICU Medical)',
   gauze : 'Dermacea USP Type VII Gauze (Covidien)',
   secondarySet : 'IV Secondary Set',
   injection: '0.9% Sodium Chloride Injection USP',
   swanGanz: 'Swan-Ganz (Edwards Lifesciences)',

 }
 var textArray = Array.from(text);
 console.log('Classifying off of: ' + textArray);
 if (textArray.includes('Safety') || textArray.includes('Catheters')) {
   console.log ('Classified: ' + titles.catheter);
   return titles.catheter;
 }
 if (textArray.includes('Inner') || textArray.includes('Cuffless')
     || textArray.includes('Shiley') || textArray.includes('Cannula')
     || textArray.includes('4DCFS')) {
   console.log ('Classified: ' + titles.tracheostomy);
   return titles.tracheostomy;
 }
 if (textArray.includes('TRANSPAC') || textArray.includes('MONITORING')) {
   console.log ('Classified: ' + titles.transpac);
   return titles.transpac;
 }
 if (textArray.includes('COVIDIEN') || textArray.includes('Derma')) {
   console.log ('Classified: ' + titles.gauze);
   return titles.gauze;
 }
 if (textArray.includes('TEAR') || textArray.includes('Alaris')
     || textArray.includes('Secondary') || textArray.includes('WARNING')
     || textArray.includes('DIRECTIONS')) {
   console.log ('Classified: ' + titles.secondarySet);
   return titles.secondarySet;
 }
 if (textArray.includes('SODIUM') || textArray.includes('CHLORIDE')
     || textArray.includes('INJECTION') || textArray.includes('USP')
     || textArray.includes('0.9%')) {
   console.log ('Classified: ' + titles.injection);
   return titles.injection;
 }
 if (textArray.includes('Edwards') || textArray.includes('Lifesciences')
     || textArray.includes('Swan-Ganz') || textArray.includes('E')) {
   console.log ('Classified: ' + titles.swanGanz);
   return titles.swanGanz;
 }
}

var Item = mongoose.model('Item', itemSchema);

var caseSchema = new Schema({
  case_number: { type: Number, index: true, unique: true },
  surgery_type: String,
  surgeon: String,
  date: { "type": Date, "default": Date.now },
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

caseSchema.plugin(autoIncrement.plugin, {
  model: 'Case',
  field: 'case_number',
  startAt: 37,
});
var Case = mongoose.model('Case', caseSchema);

// Make case_number a sequence

// Export
module.exports = {}
module.exports.Item = Item;
module.exports.Case = Case;
