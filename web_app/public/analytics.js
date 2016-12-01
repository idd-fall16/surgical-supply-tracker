var test;

(function ($) {

  var Case = Backbone.Collection.extend({
    url: '/api' + window.location.pathname.replace('/analytics', ''),
    // Specially named function that returns only the case object's item list
    // when referenced
    parse: function(data) {
      console.log("Parsed data.items: " + data.items);
      return data.items;
    }
  });

  var ChartView = Backbone.View.extend({
    initialize: function(options) {
      var scope = this;
      this.collection = options.collection;

      this.listenTo(this.collection, 'add', function() {console.log('change'); this.render()});
      scope.collection.fetch();
    },
    render: function() {
      this.renderItemUsageChart();
    },
    getCounts: function(fieldName) {
      if (fieldName != 'donating' && fieldName != 'total'
          && fieldName != 'cost' && fieldName != 'item_name') {
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
    renderItemUsageChart : function() {
      var prefCardCounts = this.getCounts('total');
      prefCardCounts = ['On Preference Card'].concat(prefCardCounts);

      var donatedCounts = this.getCounts('donating');
      donatedCounts = ['Donating'].concat(donatedCounts);

      var itemNames = this.getCounts('item_name');
      itemNames = ['x'].concat(itemNames);

      var itemUsage = c3.generate({
          bindto: '.item-usage',
          data: {
            x: 'x',
            columns: [
              itemNames,
              prefCardCounts,
              donatedCounts
            ],
            type: 'bar',
            groups: [
              ['On Preference Card', 'Donating']
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
              type: 'category',
              label: {
                text: 'Supply Type',
                position: 'middle'
              }
            }
          }
      });
    },
    initCostOverTimeChart : function() {}
  });

  var ListView = Backbone.View.extend({

  });

  var chartView = new ChartView({ collection: new Case() });

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
