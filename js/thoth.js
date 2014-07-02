/* globals nv, d3, thothApi, chartsData, realtime, graphBuilder */
/* exported thoth, showLightBox */
/* exported thoth, setRecapValue, showLightBox */
function setRecapValue(id, value, unit, round, fontColor) {
  $("#" + id + " .recap").text(value.toFixed(round) + " " + unit);
  $("#" + id + " .recap").css("color", fontColor);
}

/**
 * Show right form and data box while hiding the other forms/data boxes
 */
function showFormAndData(objectId){
 $('#' + objectId).show(); 
 ['servers','pools','realtime'].forEach(function(data){
  if (objectId == data) {
    $('#' + data).show();
    $('#' + 'params_' + data).show();
  }
  else {
    $('#' + data).hide();
    $('#' + 'params_' + data).hide();
  } 
 });
}

/**
 * Set default dates in the forms. From : Yesterday , To: Tomorrow
 */
function setDefaultFromAndToDates(){
  var today = new Date();
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  var todayStr = today.getFullYear() + '/' + ('00'+ (today.getMonth()+1)).slice(-2) + '/' + ('00'+ (today.getDate()+1)).slice(-2) + ' ' + '12:00:00';
  var yesterdayStr = yesterday.getFullYear() + '/' + ('00'+ (yesterday.getMonth()+1)).slice(-2) + '/' + ('00'+ yesterday.getDate()).slice(-2) + ' ' + '12:00:00';

  $('#params_servers #from_date').val(yesterdayStr);
  $('#params_servers #to_date').val(todayStr);

  $('#params_pools #from_date').val(yesterdayStr);
  $('#params_pools #to_date').val(todayStr);
}

/**
 * API calls grouped by board
 */

var thoth = {
  servers: function () {
    showFormAndData('servers');

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
    showFormAndData('pools');

    var self = this;

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'pool', attribute: 'avg', endpoint: 'qtime'})), function (data) {
      self._cumulativeLineGraph(chartsData.pool_query_time.options, data);
    });

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'pool', attribute: 'avg', endpoint: 'nqueries'})), function (data) {
      self._cumulativeLineGraph(chartsData.pool_query_count.options, data);
    });

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'pool', attribute: 'avg', endpoint: 'queriesOnDeck'})), function (data) {
      self._cumulativeLineGraph(chartsData.pool_query_on_deck.options, data);
    });

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'pool', attribute: 'count', endpoint: 'exception'})), function (data) {
      self._cumulativeLineGraph(chartsData.pool_exception_count.options, data);
    });

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'pool', attribute: 'integral', endpoint: 'exception'})), function (data) {
      self._cumulativeLineGraph(chartsData.pool_exception_integral.options, data);
    });

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'pool', attribute: 'integral', endpoint: 'nqueries'})), function (data) {
      self._cumulativeLineGraph(chartsData.pool_query_integral.options, data);
    });

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'pool', attribute: 'count', endpoint: 'zeroHits'})), function (data) {
      self._cumulativeLineGraph(chartsData.pool_zeroHits_count.options, data);
    });

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'pool', attribute: 'integral', endpoint: 'zeroHits'})), function (data) {
      self._cumulativeLineGraph(chartsData.pool_zeroHits_integral.options, data);
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

  /**
   * Get the active view from current URL
   * @returns string
   */
  getHash: function () {
    var hash = location.hash.split('?')[0].replace('#', '');
    if (hash === '') {
      hash = 'empty';
    }
    return hash;
  },

  _getParams: function (options) {
    //TODO: not run this every time we need params for graphs
    var paramsList = {};
    //Add dates
    paramsList['from_date'] = (Date.parse($('[data-type=from-date]').val()));
    paramsList['to_date']   = (Date.parse($('[data-type=to-date]').val()));
    //Add values of selects visible for this view
    var $formElements = $('#params>select');
    $.each($formElements, function(){
      if ($(this).is(':visible')){
        paramsList[$(this).prev().text().replace(/ /g,'').toLowerCase()] = ($(this).val());
      }
    });
    return _.extend(paramsList, options);
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
  // Deal with forms and data boxes
  if (thoth.getHash()=='empty'){
    // First time loading page and didn't select anything yet
    // Hide everything
    showFormAndData(null);
  } else {
    // URL has already a hash 
    showFormAndData(thoth.getHash());

    // updateFromHash();
  }

  $('#from_date, #to_date').datetimepicker({
    format: 'Y/m/d h:i:s'
  });

// <<<<<<< HEAD
  // Set default dates for from/to input forms
  // setDefaultFromAndToDates();

  // $('#server_settings').on('click', function (event) {
// =======
  $('[data-role="submit-settings"]').on('click', function (event) {
// >>>>>>> first steps in making the whole dashboard work based on header values
    event.preventDefault();
    //reload current view
    var hash = thoth.getHash();

    thoth[hash]();
  });

  // Listen to click on menu element
  $('nav li').on('click', function (event) {
    var activeView = $(event.currentTarget).children().text().toLowerCase();
    populateForm(activeView);
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

// $('section').hide();


// Move to on-load
// thoth.servers();
