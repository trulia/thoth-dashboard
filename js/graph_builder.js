/* globals d3, nv, chartsData */
/* exported graphBuilder */
var graphBuilder = (function (d3, nv) {
  return {
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
    }
  };
})(d3, nv, chartsData);
