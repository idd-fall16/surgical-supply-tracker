var test;

(function ($) {

  var Case = Backbone.Collection.extend({
    url: '/api' + window.location.pathname.replace('/analytics', ''),
    // Specially named function that returns only the case object's item list
    // when referenced
    parse: function(data) {
      console.log("Parsed data.items: " + data.items);
      return data.items;
    },
    getDonatedCounts: function(data) {

    }
  });

  var ChartView = Backbone.View.extend({
    initialize: function(options) {
      var scope = this;
      this.collection = options.collection;
      test = this.collection;

      this.listenTo(this.collection, 'add', function() {console.log('change'); this.render()});
      scope.collection.fetch();
    },
    render: function() {

    },
    getCounts: function(fieldName) {
      if (fieldName != 'donating' && fieldName != 'total'
          && fieldName != 'cost') {
            console.log('Invalid field name');
            return null;
      }
      var arr = []
      this.collection.each(function(model) {
        var item = model.attributes;
        arr.push(item[fieldName]);
      });
      return arr;
    },
  });

  var ListView = Backbone.View.extend({

  });

  var chartView = new ChartView({ collection: new Case() });
  test = chartView;

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
