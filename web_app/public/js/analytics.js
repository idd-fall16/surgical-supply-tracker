var test;

  var Case = Backbone.Collection.extend({
    url: '/api' + window.location.pathname.replace('/analytics', ''),
    // Specially named function that returns only the case object's item list
    // when referenced
    parse: function(data) {
      this.case_number = data.case_number;
      console.log("Parsed data.items: " + data.items);
      return data.items;
    }
  });

  var Costs = Backbone.Collection.extend({
    url: '/api' + window.location.pathname
          .replace('/analytics', '')
          .concat('/costs'),
  });

  var AnalyticsView = Backbone.View.extend({
    cost_el: $('.total-cost'),
    cost: 0,
    case_table: $('#page_content_table'),

    template: _.template($('#page_content_table_template').html()),
    case_number: $('#case_number'),
    initialize: function(options) {
      var scope = this;

      test = this;
      this.collection = options.collection;
      this.costCollection = options.costCollection;
      this.listenTo(this.collection, 'add', function() {
        console.log('collection changed');
        this.render()
      });
      this.listenTo(this.costCollection, 'add', function() {
        console.log('cost collection changed');
        this.render()
      });
      scope.collection.fetch().done(scope.render());
      scope.costCollection.fetch().done(scope.render());
    },
    render: function() {
      var scope = this;
      $(scope.case_number).empty();
      $(scope.case_number).append(scope.collection.case_number);
      scope.cost = scope.getTotalCost();
      scope.cost_el.text('$' + scope.cost);
      scope.renderItemUsageChart();

      var dates = scope.getDates();
      var allCosts = scope.getTotalCostsOverDates();

      scope.renderCostOverTimeChart(dates, allCosts);

      this.case_table.empty();
      // this.case_items = this.model.get("items");
      this.collection.each(function(model) {
        var case_item = model.attributes;
        var new_case_item = scope.template(case_item);
        scope.case_table.append(new_case_item);
      });
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
    getTotalCost: function() {
      var total = 0;
      this.collection.each(function(model) {
        var item = model.attributes;
        var cost = item.cost;
        var donating = item.donating;
        total += cost * donating;
      });
      return Math.round(total * 100) / 100;
    },
    getDates: function() {
      var arr = [];
      this.costCollection.each(function(model) {
        var costObj = model.attributes;
        console.log(costObj._id);
        arr.push(costObj._id.substring(0, 10));
      });
      // Reverse because DB returns earliest case last
      arr.reverse();
      arr.push(new Date().toLocaleDateString());
      return arr;
    },
    getTotalCostsOverDates: function() {
      var arr = ['Cost over Time'];
      this.costCollection.each(function(model) {
        var costObj = model.attributes;
        var cost = Math.round(costObj.total_cost * 100) / 100;
        arr.push(cost);
      });
      arr.push(this.cost);
      return arr;
    },
    renderItemUsageChart : function() {
      var prefCardCounts = this.getCounts('total');
      prefCardCounts = ['On Preference Card'].concat(prefCardCounts);

      var donatedCounts = this.getCounts('donating');
      donatedCounts = ['Donating'].concat(donatedCounts);

      var itemNames = this.getCounts('item_name');
      itemNames = ['x'].concat(itemNames);

      // Truncate item names
      var maxLength = 20;
      itemNames.forEach(function(el, idx, arr) {
        arr[idx] = el.substring(0, maxLength);
      });

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
              type: 'category'
            }
          }
      });
    },
    renderCostOverTimeChart : function(dates, allCosts) {
      var costOverTime = c3.generate({
          bindto: '.cost-over-time',
          data: {
            columns: [
              allCosts,
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
              type: 'category',
              categories: dates
            }
          }
      });
    }
  });
