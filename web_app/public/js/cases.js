var Cases = Backbone.Collection.extend({
  url: '/api' + window.location.pathname,
  parse: function(data) {
    console.log("Parsed data.cases: " + data.cases);
    return data.cases;
  }
});

var CasesView = Backbone.View.extend({
  // cases view consists of : cases table
  el: $('#view_cases'),
  // el_footer: $('.page_footer_content'),
  case_table: $('#page_content_table'),
  template: _.template($('#page_content_table_template').html()),
  // events: {
  //   'click #btn_stop_scan': 'stopScanning'
  initialize: function(options){

    var scope = this;
    _.bindAll(this, 'render');
    this.collection = options.collection;
    this.listenTo(this.collection, 'add', function() {console.log('change'); this.render()});
    //FIXME: poll for new data, but try with real time engine

    scope.collection.fetch();

  },
  render: function(){
    var scope = this;
    console.log("render")
    scope.case_table.empty();
    _.each(this.collection.models, function(model) {
      var case_attributes = model.attributes;
      var each_case = scope.template(case_attributes);
      scope.case_table.append(each_case);
      })
  },
  stopScanning: function(){
    console.log("scanning stopped.");
  }
});
