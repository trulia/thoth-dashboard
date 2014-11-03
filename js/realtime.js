/* globals chartsData, thothApi, d3, graphBuilder */
/* exported realtime */

var realtime = (function (graphBuilder, thothApi, chartsData, d3) {
  var graphs = [
    {data: [], attribute: 'avg',   endpoint: 'qtime',     settings: chartsData.query_time.options },
    {data: [], attribute: 'avg',   endpoint: 'nqueries',  settings: chartsData.query_time.options },
    {data: [], attribute: 'count', endpoint: 'exception', settings: chartsData.exception_count.options },
    {data: [], attribute: 'count', endpoint: 'zeroHits',  settings: chartsData.zeroHits_count.options },
  ];

  var params = {
    'objectId': 'server'
  };
  var initialize = true;

  return {

    init: function (params) {
      var self = this;
      var $svg = $('#realtime svg');
      $.each(graphs, function (idx, graph) {

        params.attribute = graph.attribute;
        params.endpoint = graph.endpoint;

        $.getJSON(thothApi.getUri(params), function (data) {
          graph.chart = graphBuilder.lineGraph(graph.settings);
          graph.data = [];
          graph.el = $svg.get(idx);

          data.values.forEach(function (val) {
            graph.data.push({x: Date.parse(val.timestamp), y: val.value});
          });
          self._updateGraph(graph);
        });
      });
    },

    show: function () {
      showFormAndData('realtime');

      var serverParams = thoth._getParams(params);
      if (initialize) {
        this.init(serverParams);
        initialize = false;
      }

      this._update();
    },

    hide: function () {
      clearInterval(this.timeout);
      $('#realtime').hide();
    },

    _update: function () {
      var self = this;

      $.getScript('https://cdn.socket.io/socket.io-1.0.0.js', function(){
        var socket = io.connect('localhost:3001');
        socket.on('new realtime data', function(data){
          $.each(graphs, function (idx, graph) {
            if (data.hasOwnProperty(graph.endpoint)) {
              // discard points after we have more then 20
              if (graph.data.length > 20)
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
      });
    },

    _updateGraph: function (graph) {
      d3.select(graph.el)
        .datum([{key: graph.settings.yLabel, values: graph.data}])
        .call(graph.chart);
    }
  };
} (graphBuilder, thothApi, chartsData, d3));