var OnboardingView = Backbone.View.extend({
    // case view consists of two main compoenents: case table, and footer bar.
    el: $('#view_onboarding'),
    new_session: $('#btn-new-session'),
    old_session: $('#btn-old-session'),
    events: {
      'click #btn-new-session': 'newSession',
      'click #btn-old-session': 'oldSession'
    },
    initialize: function(options){
      _.bindAll(this, 'render');
      var scope = this;
      console.log("initialize onboarding view")
    },
    render: function(){
      var scope = this;
    },
    newSession: function(){
      console.log("new onboarding session");
    },
    oldSession: function(){
      console.log("old onboarding session");
      alert();
    }


  });
