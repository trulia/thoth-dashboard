/* globals nv, d3, thothApi, chartsData, realtime, graphBuilder */
/* exported thoth, showLightBox */
/* exported thoth, setRecapValue, showLightBox */
function setRecapValue(id, value, unit, round, fontColor) {
  $("#" + id + " .recap").text(value.toFixed(round) + " " + unit);
  $("#" + id + " .recap").css("color", fontColor);
}

/**
 * API calls grouped by board
 */

var thoth = {
  servers: function () {
    $('#servers').show();
    var self = this;

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'server', attribute: 'avg', endpoint: 'qtime'})), function (data) {
      self._lineGraph(chartsData.query_time.options, data);
    });

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'server', attribute: 'avg', endpoint: 'nqueries'})), function (data) {
      self._lineGraph(chartsData.query_count.options, data);
    });
    $.getJSON(thothApi.getUri(self._getParams({objectId: 'server', attribute: 'avg', endpoint: 'queriesOnDeck'})), function (data) {
      self._lineGraph(chartsData.query_on_deck.options, data);
    });

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'server', attribute: 'count', endpoint: 'exception'})), function (data) {
      self._lineGraph(chartsData.exception_count.options, data);
    });

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'server', attribute: 'integral', endpoint: 'exception'})), function (data) {
      self._lineGraph(chartsData.exception_integral.options, data);
    });

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'server', attribute: 'integral', endpoint: 'nqueries'})), function (data) {
      self._lineGraph(chartsData.query_integral.options, data);
    });

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'server', attribute: 'count', endpoint: 'zeroHits'})), function (data) {
      self._lineGraph(chartsData.zeroHits_count.options, data);
    });

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'server', attribute: 'integral', endpoint: 'zeroHits'})), function (data) {
      self._lineGraph(chartsData.zeroHits_integral.options, data);
    });

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'server', attribute: 'distribution', endpoint: 'qtime'})), function (data) {
      // $.getJSON('json/distribution_qtime.json', function (data) {
      self._stackedLineGraph(chartsData.query_distribution.options, data);
    });

  },
  pools: function () {
    var self = this;

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'pool', attribute: 'avg', endpoint: 'qtime'})), function (data) {
      self._cumulativeLineGraph(chartsData.query_time.options, data);
    });

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'pool', attribute: 'avg', endpoint: 'nqueries'})), function (data) {
      self._cumulativeLineGraph(chartsData.query_count.options, data);
    });

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'pool', attribute: 'avg', endpoint: 'queriesOnDeck'})), function (data) {
      self._cumulativeLineGraph(chartsData.query_on_deck.options, data);
    });

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'pool', attribute: 'count', endpoint: 'exception'})), function (data) {
      self._cumulativeLineGraph(chartsData.exception_count.options, data);
    });

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'pool', attribute: 'integral', endpoint: 'exception'})), function (data) {
      self._cumulativeLineGraph(chartsData.exception_integral.options, data);
    });

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'pool', attribute: 'integral', endpoint: 'nqueries'})), function (data) {
      self._cumulativeLineGraph(chartsData.query_integral.options, data);
    });

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'pool', attribute: 'count', endpoint: 'zeroHits'})), function (data) {
      self._cumulativeLineGraph(chartsData.zeroHits_count.options, data);
    });

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'pool', attribute: 'integral', endpoint: 'zeroHits'})), function (data) {
      self._cumulativeLineGraph(chartsData.zeroHits_integral.options, data);
    });
    /*
    $.getJSON(thothApi.getUri(self._getParams({objectId: 'pool', attribute: 'distribution', endpoint: 'qtime'})), function (data) {
      self._stackedLineGraph(chartsData.query_distribution.options, data)
    });
    */
  },
  exceptions: function () {},
  queries: function () {},
  realtime: function () {
    realtime.show();
  },

  getHash: function () {
    var hash = location.hash.split('?')[0].replace('#', '');
    if (hash === '') {
      hash = 'servers';
    }
    return hash;
  },

  _getParams: function (options) {
    //TODO: not run this every time we need params for graphs
    var form = $('#params').serializeArray();
    var params = {};
    $.each(form, function () {


      var value = this.value || '';
      if (this.name.indexOf('date') !== -1)  {
        var timestamp = Date.parse(this.value);
        if (!isNaN(timestamp)) {
          value = new Date(timestamp).toISOString();
        }
      }

      params[this.name] = value;
    });

    location.hash = '#' + this.getHash() + '?' + $.param(params);
    // Extra options
    $.each(options, function (k, v) {
      params[k] = v;
    });


    return params;
  },
  _lineGraph: function (params, data) {

    return graphBuilder.lineGraph(params, data);
  },

  /**
   * ## Cumulative Line Graph
   *
   * Showing pool data with multiple line graph
   *
   * @param params
   * @param data
   * @private
   */
  _cumulativeLineGraph: function (params, data) {

    nv.addGraph(function() {
      var chart = nv.models.cumulativeLineChart()
          .x(function(d) { return d[0] })
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
            x: val[0], y: val[1]
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
  },

  _stackedLineGraph: function (params, data) {
    return graphBuilder.stackedAreaChart(params, data);
  }

};

// Listen for document click to close non-modal dialog
$(document).mousedown(function (e) {
  var clicked = $(e.target); // get the element clicked
  if (clicked.is('#lightbox')) {
    $('#lightbox').hide(); //or .fadeOut();
  }
});

function updateFromHash() {
  var params = location.hash.substr(location.hash.indexOf("?") + 1);
  var hash = location.hash.split('?')[0].replace('#', '');
  if (params !== "" && hash) {
    params.split('&').forEach(function (param) {
      $('#' + param.split('=')[0]).val(decodeURIComponent(param.split('=')[1]).replace('/', ''));
    });
    thoth[hash]();
  }
}

// Date picker
$('document').ready(function () {
  $('#from_date, #to_date').datetimepicker({
    format: 'Y/m/d h:i:s'
  });

  $('#server_settings').on('click', function (event) {
    event.preventDefault();
    //reload current view
    var hash = thoth.getHash();

    thoth[hash]();
  });

  $('nav li').on('click', function (event) {
    //Temp hack to hide pages
    $('section').hide();
    realtime.hide();

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

    if ($el.hasClass('active') || $el.parents('li').hasClass('active')) {
      return;
    }
    else {
      $el.siblings('.active').removeClass('active');
      $el.addClass('active');
    }
    thoth[hash]();
  });
});

function showLightBox(elem) {
  var data = chartsData[elem.parentNode.parentNode.id].values;
  var params = chartsData[elem.parentNode.parentNode.id].options;
  if (data.length !== 0) {
    $('#lightbox').show(); // or .fadeIn();
    $('#lightboxChart h2').html(chartsData[params.chartId].options.graphTitle);
    // var chart = nv.models.lineChart()
    var chart = nv.models.lineWithFocusChart()
      .tooltipContent(function (key, y, e) {
        return  params.tooltip + '<b> ' + e + '</b><br/>' + 'Time: <b>' + y + '</b></br>';
      });
    chart.yAxis.axisLabel(chart.yLabel);
    chart.lines.scatter.xScale(d3.scale.linear());
    chart.xAxis
      .axisLabel('Timestamp')
      .tickFormat(function (d) {
        return d3.time.format("%m/%d %H:%M")(new Date(d));
      });
    chart.x2Axis
      .tickFormat(function (d) {
        return d3.time.format("%m/%d %H:%M")(new Date(d));
      });

    chart.yAxis.tickFormat(d3.format(',.2f'));
    chart.y2Axis.tickFormat(d3.format(',.2f'));

    d3.select('#lightboxChart svg')
      .datum(data)
      .call(chart);

    nv.utils.windowResize(chart.update);
  }
}

// Move to on-load
// thoth.servers();
