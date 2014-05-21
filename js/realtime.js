/* globals chartsData, thothApi, d3, graphBuilder */
/* exported realtime */
var realtime = (function (graphBuilder, thothApi, chartsData, d3) {
  var graphs = [
    {data: [], attribute: 'avg', endpoint: 'qtime', settings: chartsData.query_time.options },
    {data: [], attribute: 'avg', endpoint: 'nqueries', settings: chartsData.query_time.options },
    {data: [], attribute: 'avg', endpoint: 'queriesOnDeck', settings: chartsData.query_on_deck.options },
    {data: [], attribute: 'count', endpoint: 'exception', settings: chartsData.exception_count.options },
    {data: [], attribute: 'integral', endpoint: 'exception', settings: chartsData.exception_integral.options },
    {data: [], attribute: 'integral', endpoint: 'nqueries', settings: chartsData.query_integral.options },
    {data: [], attribute: 'count', endpoint: 'zeroHits', settings: chartsData.zeroHits_count.options },
    {data: [], attribute: 'integral', endpoint: 'zeroHits', settings: chartsData.zeroHits_integral.options }
    //{attribute: 'distribution', endpoint: 'qtime', settings: chartsData.query_distribtion.options },
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
      $('#realtime').show();
      var serverParams = thoth._getParams(params);
      if (initialize) {
        this.init(serverParams);
        initialize = false;
      }

      var self = this;
      this.timeout = setInterval(function () {
        self._update();
      }, 500);
    },

    hide: function () {
      clearInterval(this.timeout);
      $('#realtime').hide();
    },

    _update: function () {
      var self = this;
      $.getJSON('/json/realtime.json', function (data) {
        $.each(graphs, function (idx, graph) {

          if (graph.data.length > 100)
          {
            graph.data.shift();
          }

          graph.data.push({
            //once we have the actual endpoint we should use .timestamp
            //instead
            x: Date.now(),//Date.parse(data[graph.endpoint][graph.attribute].timestamp)
            y: data[graph.endpoint][graph.attribute].value
          });
          self._updateGraph(graph);
        });
      });
    },

    _updateGraph: function (graph) {
      d3.select(graph.el)
      .datum([{key: graph.settings.yLabel, values: graph.data}])
      .call(graph.chart);
    }
  };
}(graphBuilder, thothApi, chartsData, d3));


