var test;

(function ($) {

  var Case = Backbone.Collection.extend({
    url: '/api' + window.location.pathname.replace('/analytics', ''),
    // Specially named function that returns only the case object's item list
    // when referenced
    parse: function(data) {
      return data.items;
    },
    getPrefCardCounts: function() {
      for (var item in this.items) {
        console.log(item.item_names)
        console.log(item.total);
      }
    },
    getDonatedCounts: function(data) {

    }
  });

  var ChartView = Backbone.View.extend({
    initialize: function(options) {
      var scope = this;
      this.collection = options.collection;
      this.listenTo(this.collection, 'add', function() {console.log('change'); this.render()});
      // _.bindAll(this, 'render');
      scope.collection.fetch();
      console.log(this.collection);

      this.collection.getPrefCardCounts();
    },
    render: function() {}
  });

  var ListView = Backbone.View.extend({

  });

  var chartView = new ChartView({ collection: new Case() });

  var itemUsage = c3.generate({
      bindto: '.item-usage',
      data: {
        columns: [
          ['On Preference Card', 30, 50, 10],
          ['Donated', 20, 10, 2]
        ],
        type: 'bar',
        groups: [
          ['On Preference Card', 'Donated']
        ]
      },
      axis: {
        y: {
          label: {
            text: 'Number of Items',
            position: 'outer-middle'
          }
        },
        x: {
          label: {
            text: 'Supply Type',
            position: 'middle'
          }
        }
      }
  });

  var costOverTime = c3.generate({
      bindto: '.cost-over-time',
      data: {
        columns: [
          ['Cost', 1000, 900, 234, 890, 740, 600, 761],
        ],
      },
      axis: {
        y: {
          label: {
            text: 'Dollars',
            position: 'outer-middle'
          }
        },
        x: {
          label: {
            text: 'Date',
            position: 'outer-middle'
          }
        }
      }
  });
})(jQuery);
