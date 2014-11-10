/* globals d3, nv, chartsData */
/* exported graphBuilder */
var graphBuilder = (function (d3, nv) {

  return {

    /**
     * lineGraph
     * @param params
     * @param data
     * @returns {*}
     */
    lineGraph: function (params, data) {
      var chart = nv.models.lineChart().color([params.color])
        .tooltipContent(function (key, y, e) {
          // Update values realtime
          $('#' + params.chartId + ' h3.value').html(e);
          $('#' + params.chartId + ' h3.timestamp').html(y);
          return  ' Value: ' + '<b>' + d3.round(e, 2) + '</b><br/>' + 'Time: <b>' + y + '</b></br>';
        });

      chart.yAxis.axisLabel(chart.yLabel);
      chart.yAxis.tickFormat(d3.format(',.' + params.round + 'f'));
      chart.xAxis
      .tickFormat(function (d) {
        return d3.time.format("%m/%d %H:%M:%S")(new Date(d));
      });

      if (data) {
        var v = [];
        data.values.forEach(function (val) {
          v.push({x: Date.parse(val.timestamp), y: val.value});
        });
        //TODO: not this
        chartsData[params.chartId].values = [{key: params.yLabel, values: v}];

        d3.select('#' + params.chartId + ' svg')
        .datum(chartsData[params.chartId].values)
        .call(chart);
      }

      nv.utils.windowResize(chart.update);
      return chart;
    },

    /**
     * stackedAreaChart
     * @param params
     * @param data
     * @returns {*}
     */
    stackedAreaChart: function (params, data) {
      var chart = nv.models.stackedAreaChart();

      chart.useInteractiveGuideline(true)
        .x(function (d) { return d[0]; })
        .y(function (d) { return d[1]; })
        .style("expand")
        .showControls(false)
        .transitionDuration(300);


      chart.xAxis
      .tickFormat(function (d) { return d3.time.format('%x')(new Date(d)); });

      // chart.yAxis.tickFormat(d3.format('d'));

      var v = [];
      ["between_0_10", "between_10_100", "between_100_1000", "over_1000"].forEach(function (key) {
        var temp = [];
        data.values.forEach(function (val) {
          temp.push([Date.parse(val.timestamp), val[key]]);
        });
        v.push({ "key": key, "values": temp});

      });

      d3.select('#' + params.chartId)
        .datum(v)
        .transition().duration(0)
        .call(chart);

      nv.utils.windowResize(chart.update);

      d3.select("g.nv-controlsWrap")
        .attr("transform", "translate(-60,-90)");

      return chart;
    },

    /**
     * cumulativeLineGraph
     * @param params
     * @param data
     */
    cumulativeLineGraph: function(params, data) {
      nv.addGraph(function() {
        var chart = nv.models.cumulativeLineChart()
            .x(function(d) { return Date.parse(d[0]) })
            .y(function(d) { return d[1] }) //adjusting, 100% is 1.00, not 100 as it is in the data
            .color(d3.scale.category10().range())
            .useInteractiveGuideline(true)
          ;
        //chartsData[params.chartId].options.color = d3.scale.category10().range();
        chart.xAxis
          .tickValues([1078030800000,1122782400000,1167541200000,1251691200000])
          .tickFormat(function(d) {
            return d3.time.format('%x')(new Date(d))
          });

        // Formatting values to be represented with 3 figures and a symbol
        chart.yAxis
          .tickFormat(function(d) {
            return d + d3.formatPrefix(d).symbol();
          })
          .tickFormat(d3.format('.3s'));

        // Populate values for lightbox display
        data.forEach(function(obj) {
          var v = [];
          obj.values.forEach(function (val) {
            v.push({
              // set x to date, y to value
              x: Date.parse(val[0]), y: val[1]
            });
          });
          chartsData[params.chartId].values.push({key: obj.key, values: v});
        });

        d3.select('#' + params.chartId + ' svg')
          .datum(data)
          .call(chart);

        //TODO: Figure out a good way to do this automatically
        nv.utils.windowResize(chart.update);

        return chart;
      });
    }
  };
})(d3, nv, chartsData);
