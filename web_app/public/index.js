(function($){

  var ListView = Backbone.View.extend({
    el: $('body'),
    initialize: function(){
      _.bindAll(this, 'render');
      this.render();
    },
    render: function(){
      $(this.el).append(
        "<h1>Scan Surgical Supplies</h1><h2>Upload Photo from Smart Wastebin</h2><input type='file' id='upload'><h2>Item is...</h2><div id='preview'></div><span>No items yet.</span>"
      );
    }


  });

  var listView = new ListView();











})(jQuery);
