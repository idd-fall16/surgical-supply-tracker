//http://stackoverflow.com/questions/7511567/backbone-js-navigating-to-a-route-after-the-click-event-on-a-view


var App = Backbone.Router.extend({
  routes: {
    "" : "onboarding",
    "onboarding" : "onboarding",
    "cases/:caseID" : "case",
    "cases/:caseID/analytics" : "analytics",
    "cases" : "cases",
  },
  initialize: function(){
    console.log('initialize');
  },
  onboarding: function(){
    console.log("onboarding");
    this.onboardingView = new OnboardingView();
  },
  case: function(id){
    this.caseView = new CaseView({ collection: new Case() });
  },
  cases: function(){
    this.casesView = new CasesView({ collection: new Cases() });
  },
  analytics: function(){
    // alert();
    this.analyticsView = new AnalyticsView({ collection: new Case() });
  }
});


var AppView = Backbone.View.extend({
  initialize: function(){
    this.router = new App();
    Backbone.history.start({pushState: true, root: '/'});
    var path = location.pathname;
    this.router.navigate(path, {trigger: true});
  }
})

new AppView();
