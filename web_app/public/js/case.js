  var Case = Backbone.Collection.extend({
    url: '/api' + window.location.pathname,
    parse: function(data) {
      // debugger;
      this.case_number = data.case_number;
      console.log("Parsed data.items: " + data.items);
      return data.items;
    }
  })

  var CaseView = Backbone.View.extend({
    // case view consists of two main compoenents: case table, and footer bar.
    el: $('#view_case'),
    el_footer: $('.page_footer_content'),
    case_table: $('#page_content_table'),
    case_number: $('#case_number'),
    btn_finish: $('#btn_stop_scan'),
    template: _.template($('#page_content_table_template').html()),
    events: {
      'click #btn_stop_scan': 'stopScanning',
      'click #btn_analytics': 'viewAnalytics'
    },
    initialize: function(options){
      var scope = this;
      _.bindAll(this, 'render');
      $(".page_footer_content").show();
      $(".page_footer_finish").hide();
      this.collection = options.collection;
      $(this.el).find(this.el_footer).append("<div class='columns small-3'><button id='btn_stop_scan' href='#' class='button'><h3>STOP SCANNING</h3></button></div>");


      this.listenTo(this.collection, 'add', function() {console.log('change'); this.render()});
      //FIXME: poll for new data, but try with real time engine
      setInterval(function() {
        scope.collection.fetch();
        scope.render();
      }, 1000);





    },
    render: function(){
      var scope = this;
      $(scope.el).find(scope.case_number).empty();
      // debugger;
      $(scope.el).find(scope.case_number).append(scope.collection.case_number);
      console.log("render")
      this.case_table.empty();
      // this.case_items = this.model.get("items");
      this.collection.each(function(model) {
        var case_item = model.attributes;
        var new_case_item = scope.template(case_item);
        scope.case_table.append(new_case_item);
      });
      // debugger;

    },
    stopScanning: function(){
      console.log("scanning stopped.");
      $(".page_footer_content").hide();
      $(".page_footer_finish").show();
      $("#page_footer").css("background-color", "#fff");
    },
    viewAnalytics: function(){
      window.location.href = window.location.href + '/analytics';
    }
  });
