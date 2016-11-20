(function($){

  var OnboardingView = Backbone.View.extend({
    // case view consists of two main compoenents: case table, and footer bar.
    el: $('#view_onboarding'),
    events: {
      // 'click #btn_stop_scan': 'stopScanning'
    },
    initialize: function(options){
      _.bindAll(this, 'render');
      var scope = this;
    },
    render: function(){
      var scope = this;
    },


  });

  var onboardingView = new OnboardingView();











})(jQuery);
