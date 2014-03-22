/* globals nv, d3 */
function setRecapValue(id, value, unit, round, fontColor) {
  $( "#" + id + " .recap" ).text(value.toFixed(round) + " " + unit);
  $( "#" + id + " .recap" ).css("color", fontColor);
}

var thoth = {
  dashboard: function () {

    var self = this;
    $.getJSON('json/avg_nqueries.json', function (data) {
      self._lineGraph({
        'name' : 'Average Qtime',
        'tooltip' : 'Avg Qtime: ',
        'yLabel' : 'Avg QTime (ms)',
        'chartId' : 'query_time',
        'color': '#7fd5e3',
        'unit' : 'sec',
        'round' : 2
       }, data)
    });

    $.getJSON('json/avg_nqueries.json', function (data) {
      self._lineGraph({
        'name' : 'Average number of queries',
        'tooltip' : 'Avg # queries: ',
        'yLabel' : 'Avg number of queries',
        'chartId' : 'query_count',
        'color': '#77dba2',
        'unit' : '',
        'round' : 0
       }, data)
    });

    $.getJSON('json/avg_nqueries.json', function (data) {
      self._lineGraph({
        'name' : 'Avg queries on deck',
        'tooltip' : 'Avg queries on deck: ',
        'yLabel' : 'Avg queries on deck',
        'chartId' : 'query_on_deck',
        'color': '#F3C684',
        'unit' : '',
        'round' : 0
       }, data)
    });

    $.getJSON('json/distribution_qtime.json', function (data) {
      self._stackedLineGraph({
        'name' : 'Distribution of query times',
        'tooltip' : 'Number of queries: ',
        'yLabel' : 'Number of queries',
        'chartId' : 'query_distribution',
        'color': '#7fd5e3'
       }, data)
    });

  },
  servers: function () {},
  pools: function () {},
  exceptions: function () {},
  queries: function () {},
  realtime: function () {},

  _getParams: function () {
    var form = $('#params').serializeArray();
    var params = {};
    $.each(form, function () {
      params[this.name] = this.value || '';
    });
    return params;
  },

  _lineGraph: function (params, data) {
    var chart = nv.models.lineChart()
      .width(400).height(150).color([params.color])
      .tooltipContent(function (key, y, e) {
        return  params.tooltip + '<b>' + d3.round(e, 2) + '</b><br/>' + 'Time: <b>' + y + '</b></br>';
      });

    chart.yAxis.axisLabel(chart.yLabel);

    chart.xAxis
      .axisLabel('Timestamp')
      .tickFormat(function (d) {
        return d3.time.format("%m/%d %H:%M:%S")(new Date(d));
      });

    /*chart.x2Axis
      .axisLabel('Timestamp')
      .tickFormat(function (d) {
        return d3.time.format("%H:%M")(new Date(d));
      });
    */
    var v = []
    data.values.forEach(function (val, idx) {
      v.push({x: Date.parse(val.timestamp), y: val.value});
    });

    d3.select('#' + params.chartId + ' svg')
      .datum([{key: 'chart', values: v}])
      .call(chart);

    // TO REMOVE
    //setRecapValue(params.chartId + ' h2', data[0].values.slice(-1)[0].y, params.unit, params.round, params.color);


    nv.utils.windowResize(chart.update);

    return chart;
  },

  _stackedLineGraph: function (params, data) {

    console.log(data);
    var chart = nv.models.stackedAreaChart()
      .useInteractiveGuideline(true)
      .x(function (d) { return d[0]; })
      .y(function (d) { return d[1]; })
      .style("expand")
      .transitionDuration(300).width(400).height(250);

    chart.xAxis
      .tickFormat(function (d) { return d3.time.format('%x')(new Date(d)); });

    chart.yAxis.tickFormat(d3.format('d'));

    var v = []
    data.values.forEach(function (val, idx) {
      v.push({x: Date.parse(val.timestamp), y: val.value});
    });
    d3.select('#' + params.chartId)
      .datum([{key: 'chart', values: v}])
      .transition().duration(0)
      .call(chart);

    nv.utils.windowResize(chart.update);
  }

};

$('nav li').on('click', function (event) {
  event.preventDefault();
  var $el = $(this);
  var hash;
  if (event.target.nodeName === 'LI') {
    //update url hash if needed
    hash = $el.find('a').attr('href');
    location.hash = hash;
  }
  else {
    hash = $(event.target).attr('href');
  }

  hash = hash.replace('#', '');

  if ($el.hasClass('active')) {
    return;
  }
  else {
    $el.siblings('.active').removeClass('active');
    $el.addClass('active');
  }

  thoth[hash]();


});

