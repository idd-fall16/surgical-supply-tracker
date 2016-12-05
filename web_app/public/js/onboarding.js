var OnboardingView = Backbone.View.extend({
    // case view consists of two main compoenents: case table, and footer bar.
    el: $('#view_onboarding'),
    new_session: $('#btn-new-session'),
    old_session: $('#btn-old-session'),
    btn_to_surgeon: $('#btn_to_surgeon'),
    pg_main: $('#page_content_main'),
    pg_surgery: $('#page_content_surgery'),
    pg_surgeon: $('#page_content_surgeon'),
    events: {
      'click #btn-new-session': 'newSession',
      'click #btn-old-session': 'oldSession',
      'click #btn_to_surgeon': 'toSurgeon'
    },
    initialize: function(options){
      _.bindAll(this, 'render');
      this.new_session.onclick = 'capture_image()'
      var scope = this;
      console.log("initialize onboarding view")
      $(this.el).find(this.pg_surgery).hide();
      $(this.el).find(this.pg_surgeon).hide();
    },
    render: function(){
      var scope = this;
    },
    newSession: function(){
      console.log("new onboarding session");


      $(this.el).find(this.pg_main).hide();
      $(this.el).find(this.pg_surgery).show();



    },
    oldSession: function(){
      console.log("old onboarding session");
      // alert();
    },
    toSurgeon: function(){
      $(this.el).find(this.pg_main).hide();
      $(this.el).find(this.pg_surgery).hide();
      $(this.el).find(this.pg_surgeon).show();
      $.ajax({
          url:"send_photo_buttons",
          type: "get",
          success: function(res){
            console.log("success", res);
          }
        }).done(function(o){
          //do something
          console.log("done", o);
        });
    }


  });
