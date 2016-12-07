var OnboardingData = Backbone.Collection.extend({
  url: '/api/case_values',
  parse: function(data) {
    return data;
  }
});


var OnboardingView = Backbone.View.extend({
    // case view consists of two main compoenents: case table, and footer bar.
    el: $('#view_onboarding'),
    new_session: $('#btn-new-session'),
    old_session: $('#btn-old-session'),
    btn_to_surgeon: $('#btn_to_surgeon'),
    btn_to_session: $('#btn_to_session'),
    pg_main: $('#page_content_main'),
    pg_surgery: $('#page_content_surgery'),
    pg_surgeon: $('#page_content_surgeon'),
    list_surgeries: $('#list_surgeries'),
    list_surgeons: $('#list_surgeons'),
    surgery_template: _.template($('#page_content_surgery_template').html()),
    surgeon_template: _.template($('#page_content_surgeon_template').html()),
    events: {
      'click #btn-new-session': 'newSession',
      'click #btn-old-session': 'oldSession',
      'click #btn_to_surgeon': 'toSurgeon',
      'click #btn_to_session': 'toSession'
    },
    initialize: function(options){
      var scope = this;
      console.log("initialize onboarding view")
      _.bindAll(this, 'render');
      this.collection = options.collection;
      this.listenTo(this.collection, 'add', function() {console.log('change'); this.render()});

      $(this.el).find(this.pg_surgery).hide();
      $(this.el).find(this.pg_surgeon).hide();
      scope.collection.fetch();
    },
    render: function(){
      var scope = this;

      _.each(this.collection.models, function(model) {
        var surgery_types = model.attributes.surgery_types;
        var surgeons = model.attributes.surgeons;

        _.each(surgery_types, function(surgery_type){
            var surgery = scope.surgery_template(surgery_type);
            scope.list_surgeries.append(surgery);
        });

        _.each(surgeons, function(surgeon){
            var surgeon = scope.surgeon_template(surgeon);
            scope.list_surgeons.append(surgeon);
        });



      });
    },
    newSession: function(){
      console.log("new onboarding session");
      $(this.el).find(this.pg_main).hide();
      $(this.el).find(this.pg_surgery).show();
    },
    oldSession: function(){
      console.log("old onboarding session");
      // alert();
      window.location.href = '/cases'
    },
    toSurgeon: function(){
      $(this.el).find(this.pg_main).hide();
      $(this.el).find(this.pg_surgery).hide();
      $(this.el).find(this.pg_surgeon).show();
    },
    toSession: function(){
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


        var selected_surgery = $("select#list_surgeries option:selected").text();
        var selected_surgeon = $("select#list_surgeons option:selected").text();
        var dataString = {"surgeon" :selected_surgeon , "surgery_type":selected_surgery};

        $.ajax({
           type: "POST",
           url: "api/cases",
           data: JSON.stringify(dataString),
           contentType: "application/json",
           success: function(res) {
            window.location.href = '/cases/' + res.case_number //change to correct id
           },
           error: function(e){
             alert(e);
             console.log(e);
           }
         });


        //this.collection.

    }



  });
