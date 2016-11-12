(function($){

  var SurgicalItem  = Backbone.Model.extend({
    defaults: {
      item_name: "Example Item",
      item_number: "123",
      weight: "20",
      cost: "12"

    }
  })

  var Case = Backbone.Collection.extend({
    model: SurgicalItem
  })

  var CaseView = Backbone.View.extend({
    // elements to render
    el: $('#view_case'),
    el_footer: $('.page_footer_content'),
    events: {
      'click #btn_start_scan': 'startScanning',
      'click #btn_stop_scan': 'stopScanning'
    },
    initialize: function(){
      _.bindAll(this, 'render');

      this.collection = new Case();
      // this.collection.bind('btn_start_scan', this.startScanning);

      this.render();
    },
    render: function(){
      var self = this;
      $(this.el).find(this.el_footer).append("<div class='columns small-3'><button id='btn_start_scan' href='#' class='button'><h3>BEGIN SCANNING</h3></button></div>");
      $(this.el).find(this.el_footer).append("<div class='columns small-3'><button id='btn_stop_scan' href='#' class='button'><h3>STOP SCANNING</h3></button></div>");
      $('#btn_stop_scan').hide();
      $(this.el).find('#page_content').append("<h2>Item is...</h2>");
      $(this.el).find('#page_content').append("<div id='preview'></div><span>No items yet.</span>");
      _(this.collection.models).each(function(item){ // in case collection is not empty
        self.appendItem(item);
      }, this);
    },
    startScanning: function(){
      console.log("listening...");
      //replace start scan button with stop scan
      //start scanning
      $('#btn_start_scan').hide();
      $('#btn_stop_scan').show();

      var item = new SurgicalItem();
      var item2 = new SurgicalItem();
      item.set({
        item_name: "Gauze",
        item_number: "231",
        weight: "50",
        cost: "10"
      });
      item2.set({
        item_name: "Sponge",
        item_number: "123",
        weight: "50",
        cost: "10"
      });
      this.collection.add(item);
      this.collection.add(item2);
      debugger;

    },
    stopScanning: function(){
      console.log("scanning stopped.");
      $('#btn_stop_scan').hide();
      $('#btn_start_scan').show();
    }


  });


  var caseView = new CaseView();











})(jQuery);
