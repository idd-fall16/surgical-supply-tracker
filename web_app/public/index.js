(function($){

  var CaseItemList  = Backbone.Model.extend({
      defaults: {


      },
      url: '/api/cases/3'
})

  var Case = Backbone.Collection.extend({
    model: CaseItemList,
    url: ''
  })

  var CaseView = Backbone.View.extend({
    // case view consists of two main compoenents: case table, and footer bar.
    el: $('#view_case'),
    el_footer: $('.page_footer_content'),
    case_table: $('#page_content_table'),
    template: _.template($('#page_content_table_template').html()),
    events: {
      'click #btn_start_scan': 'startScanning',
      'click #btn_stop_scan': 'stopScanning'
    },
    initialize: function(options){
      _.bindAll(this, 'render');
      var scope = this;
      this.collection = new Case();
      this.model.fetch().done(function(){
        scope.render();
      });
    },
    render: function(){
      var scope = this;
      this.case_items = this.model.get("items");
      //render table view

      //render status and action
      $(this.el).find(this.el_footer).append("<div class='columns small-3'><button id='btn_start_scan' href='#' class='button'><h3>BEGIN SCANNING</h3></button></div>");
      $(this.el).find(this.el_footer).append("<div class='columns small-3'><button id='btn_stop_scan' href='#' class='button'><h3>STOP SCANNING</h3></button></div>");
      $('#btn_stop_scan').hide();
      // debugger;
      _(this.case_items).each(function(case_item){ // in case collection is not empty
        //self.appendItem(item);
        var new_case_item = scope.template(case_item);
        scope.case_table.append(new_case_item);
      }, this);
    },
    startScanning: function(){
      console.log("listening...");
      //replace start scan button with stop scan
      //start scanning
      $('#btn_start_scan').hide();
      $('#btn_stop_scan').show();



    },
    stopScanning: function(){
      console.log("scanning stopped.");
      $('#btn_stop_scan').hide();
      $('#btn_start_scan').show();
    }


  });

  var caseView = new CaseView({model: new CaseItemList()});











})(jQuery);
