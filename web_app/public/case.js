(function($){

  var CaseItemList  = Backbone.Model.extend({
      defaults: {


      },
      url: '/api/cases/1'
})

  var Case = Backbone.Collection.extend({
    url: '/api/cases/1',
    parse: function(data) {
      console.log("Parsed data.items: " + data.items);
      return data.items;
    }
  })

  var CaseView = Backbone.View.extend({
    // case view consists of two main compoenents: case table, and footer bar.
    el: $('#view_case'),
    el_footer: $('.page_footer_content'),
    case_table: $('#page_content_table'),
    template: _.template($('#page_content_table_template').html()),
    events: {
      'click #btn_stop_scan': 'stopScanning'
    },
    initialize: function(options){
      _.bindAll(this, 'render');
      var scope = this;
      $(this.el).find(this.el_footer).append("<div class='columns small-3'><button id='btn_stop_scan' href='#' class='button'><h3>STOP SCANNING</h3></button></div>");
      this.collection = new Case();
      this.listenTo(this.collection, 'add', function() {console.log('change'); this.render()});
      setInterval(function() {
        scope.collection.fetch();
      }, 1000);

    },
    render: function(){
      var scope = this;
      console.log("render")
      this.case_table.empty();
      this.case_items = this.model.get("items");
      //render table view

      //render status and action
      // $(this.el).find(this.el_footer).append("<div class='columns small-3'><button id='btn_start_scan' href='#' class='button'><h3>BEGIN SCANNING</h3></button></div>");

      // $('#btn_stop_scan').hide();
      // debugger;
      console.log("collection: " + JSON.stringify(this.collection));
      this.collection.each(function(model) {
        var case_item = model.attributes;
        var new_case_item = scope.template(case_item);
        scope.case_table.append(new_case_item);
      });
      // _.each(scope.collection, function(el, idx, list){ // in case collection is not empty
      //   //self.appendItem(item);
      //   console.log(el);
      //   console.log(list);
      //   var new_case_item = scope.template(case_item);
      //   scope.case_table.append(new_case_item);
      // }, this);
    },
    stopScanning: function(){
      console.log("scanning stopped.");
    }


  });

  var Workspace = Backbone.Router.extend({
    routes: {
      "cases/:id":         "getCase",
      "":                  "home"
    },
    getCase : function(id){
      debugger;
      console.log("hi");
      console.log(id);
    },
    home: function(){
      console.log()
    }
  })
  var app_router = new Workspace;
  var caseView = new CaseView({model: new CaseItemList()});











})(jQuery);
