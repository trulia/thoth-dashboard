/* The glorious THOTH, aka where api calls happen and proper graphs get built using response data */

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
  },

  slowqueries: function (npage) {
    showFormAndData('slowqueries');
    var self = this;
    var $paginationDemo = $('[data-role=slowqueries_pagination_demo]'),
      $paginationWrapper = $('[data-role=slowqueries_pagination_wrapper]');

    if(npage == undefined) {
      npage = 1;
    }

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'server', attribute: 'list', endpoint: 'slowqueries', page: npage})), function (data) {
      //TODO handle negative case
      var pages = Math.round(data.numFound / 12) - 1;

      $paginationDemo.remove();
      $paginationWrapper.append('<ul data-role="slowqueries_pagination_demo" class="pagination-sm pagination-demo"></ul>');
      $paginationDemo.twbsPagination({
        totalPages: pages,
        visiblePages: 7,
        onPageClick: function (event, page) {
          $.getJSON(thothApi.getUri(self._getParams({objectId: 'server', attribute: 'list', endpoint: 'slowqueries', page: page})), function (data) {
            self._fill_slowQuery(page, data);
          });
        }
      });
    });
  },

  exceptions: function (npage) {
    showFormAndData('exceptions');
    var self = this;
    var $paginationDemo = $('[data-role=exceptions_pagination_demo]'),
      $paginationWrapper = $('[data-role=exceptions_pagination_wrapper]');

    if(npage == undefined) {
      npage = 1;
    }

    $.getJSON(thothApi.getUri(self._getParams({objectId: 'server', attribute: 'list', endpoint: 'exception', page: npage})), function (data) {
      //TODO handle negative case
      var pages = Math.round(data.numFound / 12) - 1;

      $paginationDemo.remove();
      $paginationWrapper.append('<ul data-role="exceptions_pagination_demo" class="pagination-sm pagination-demo"></ul>');
      $paginationDemo.twbsPagination({
        totalPages: pages,
        visiblePages: 7,
        onPageClick: function (event, page) {
          $.getJSON(thothApi.getUri(self._getParams({objectId: 'server', attribute: 'list', endpoint: 'exception', page: page})), function (data) {
            self._fill_exceptions(page, data);
          });
        }
      });
    });
  },

  realtime: function () {
    realtime.show();
  },

  _fill_slowQuery: function(page, data){

    var $content = $('[data-role=slowqueries_content]'),
      $pageContent = $('[data-role=slowqueries_page_content]');

    // Remove previous slow query boxes
    $content.remove();
    // Create the container for the new boxes
    $pageContent.append('<div data-role="slowqueries_content"></div>');

    for (var i=0; i < data.values.length; i++){
      var el = data.values[i];
      var plainDate = new Date(el.timestamp);
      // Month/Day/Year Time/am-pm
      var formattedDate = plainDate.getMonth() + "/" + plainDate.getDate() + "/" + plainDate.getFullYear() + " " + plainDate.getHours() + ":" + plainDate.getMinutes() + ":" + plainDate.getSeconds();
      $('[data-role=slowqueries_content]').append('<div id="slowquery-box-' + i + '" class="slowquery-box col-md-3"><div class="timestamp slowquery">'
      + formattedDate +'</div><a><i class="entypo eye" onClick="showListLightBox(this);"></i></a><div class="qtime">'
      + formatQtime(el.qtime) + '</div><div class="query"> <label>Query</label><p class="query-text">'
      + el.query + '</p></div></div>');
    }
  },

  _fill_exceptions: function(page, data){

    var $content = $('[data-role=exceptions_content]'),
      $pageContent = $('[data-role=exceptions_page_content]');
    // Remove previous slow query boxes
    $content.remove();
    // Create the container for the new boxes
    $pageContent.append('<div data-role="exceptions_content"></div>');

    for (var i=0; i < data.values.length; i++){
      var el = data.values[i];
      var plainDate = new Date(el.timestamp);
      // Month/Day/Year Time/am-pm
      var formattedDate = plainDate.getMonth() + "/" + plainDate.getDate() + "/" + plainDate.getFullYear() + " " + plainDate.getHours() + ":" + plainDate.getMinutes() + ":" + plainDate.getSeconds();
      var exceptionName = el.exception.substr(0, el.exception.indexOf(' '));
      $('[data-role=exceptions_content]').append('<div id="slowquery-box-'+i+'" class="slowquery-box col-md-3"><div class="timestamp exception">'
      + formattedDate + '</div><a><i class="entypo eye" onClick="showListLightBox(this);"></i></a><div class="exceptionName truncate">' + exceptionName + '</div><div class="query-exception"><label>StackTrace</label><p class="query-text">'
      + el.exception + '</div><div class="query"> <label>Query</label><p class="query-text">'
      + el.query + '</p></div></div>');
    }
  },

  _getParams: function (options) {
    //TODO: not run this every time we need params for graphs
    var paramsList = {};
    //Add dates
    paramsList['from_date'] = new Date(Date.parse($('[data-role=from_date_input]').val())).toISOString();
    paramsList['to_date']   = new Date(Date.parse($('[data-role=to_date_input]').val())).toISOString();
    //Add values of selects visible for this view
    var $formElements = $('#params select');
    $.each($formElements, function(){
      if ($(this).is(':visible')){
        paramsList[$(this).prev().text().replace(/ /g,'').toLowerCase()] = ($(this).val());
      }
    });
    return $.extend(paramsList, options);
  },

  /**
   * _lineGraph
   * @param params
   * @param data
   * @returns {*}
   * @private
   */
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
    return graphBuilder.cumulativeLineGraph(params, data);
  },

  /**
   * _stackedLineGraph
   * @param params
   * @param data
   * @returns {*}
   * @private
   */
  _stackedLineGraph: function (params, data) {
    return graphBuilder.stackedAreaChart(params, data);
  }
};