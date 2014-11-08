/* globals chartsData, thothApi, d3, graphBuilder */
/* exported realtime */

var realtime = (function (graphBuilder, thothApi, chartsData, d3) {
  var graphs = [
    {data: [], attribute: 'avg',   endpoint: 'qtime',     settings: chartsData.query_time.options },
    {data: [], attribute: 'avg',   endpoint: 'nqueries',  settings: chartsData.query_time.options },
    {data: [], attribute: 'count', endpoint: 'exception', settings: chartsData.exception_count.options },
    {data: [], attribute: 'count', endpoint: 'zeroHits',  settings: chartsData.zeroHits_count.options },
  ];

  var maxPointsDisplayed =  20;

  return {

    init: function () {
      var self = this;
      var $svg = $('#realtime svg');

      $.each(graphs, function (idx, graph) {
        graph.chart = graphBuilder.lineGraph(graph.settings);
        graph.data = [];
        graph.el = $svg.get(idx);
        self._updateGraph(graph);
      });
    },

    show: function () {
      showFormAndData('realtime');
      this.init();
      this._update();
    },

    hide: function () {
      clearInterval(this.timeout);
      $('#realtime').hide();
    },

    _update: function () {
      var self = this;

      if (typeof self.socket == 'undefined') {
        $.getScript('https://cdn.socket.io/socket.io-1.2.0.js', function(){
          self.socket = io.connect('localhost:3001');
          self._sendNewData();
        });
      }
    },

    _updateGraph: function (graph) {
      d3.select(graph.el)
        .datum([{key: graph.settings.yLabel, values: graph.data}])
        .call(graph.chart);
    },

    _getCurrentQueryParams: function () {
      return {
        server: $('[data-role=server_values_select]').val(),
        core: $('[data-role=core_values_select]').val(),
        port: $('[data-role=port_values_select]').val()
      };
    },

    _sendNewData: function () {
      var self = this;
      self.socket.emit('queryParams', self._getCurrentQueryParams());
      self.socket.on('new realtime data', function(data){
        $.each(graphs, function (idx, graph) {
          if (data.hasOwnProperty(graph.endpoint)) {
            // discard points after we have more then 20
            if (graph.data.length > maxPointsDisplayed)
            {
              graph.data.shift();
            }
            graph.data.push({
              x: data[graph.endpoint][0].timestamp,
              y: data[graph.endpoint][0].value
            });
            self._updateGraph(graph);
          }
        });
      });
    }
  };
} (graphBuilder, thothApi, chartsData, d3));