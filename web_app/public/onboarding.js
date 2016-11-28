(function($){

  var OnboardingView = Backbone.View.extend({
    // case view consists of two main compoenents: case table, and footer bar.
    el: $('#view_onboarding'),
    new_session: $('#btn-new-session'),
    old_session: $('#btn-old-session'),
    events: {
      'click #btn-new-session': 'newSession',
      'click #btn-new-session': 'oldSession'
    },
    initialize: function(options){
      _.bindAll(this, 'render');
      var scope = this;
    },
    render: function(){
      var scope = this;
    },
    newSession: function(){
      alert();
    },
    oldSession: function(){

    }


  });

  var onboardingView = new OnboardingView();











})(jQuery);
