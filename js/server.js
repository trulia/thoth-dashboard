// Default time ranges
var start = "NOW-1DAY";
var end = "NOW";
// Default server infos
var server = ""
var core = ""
var port = ""

var exceptionCountDetails = [{ "fieldName": "exceptionCount_i", "description" : "Number of exceptions"}, {"fieldName": "tot-count_i", "description" : "Total number of queries"} ];
var hitsCountDetails = [{ "fieldName": "zeroHits-count_i", "description" : "Queries with 0 hits"}, {"fieldName": "tot-count_i", "description" : "Total number of queries"} ];
var qtimeDistributionDetails =  [{ "fieldName": "range-0-10_i", "description" : "Between 0 and 10 ms"}, {"fieldName": "range-10-100_i", "description" : "Between 10 and 100 ms"},{"fieldName": "range-100-1000_i", "description": "Between 100 and 1000 ms"}, {"fieldName": "range-1000-OVER_i", "description": "Over 1000 ms"} ];



var NOW = {"name":"now", "value":"NOW", "default" : false };
var YESTERDAY = {"name":"yesterday", "value":"NOW-1DAY", "default" : false};
var TWO_DAYS_AGO = {"name":"2 days ago", "value":"NOW-2DAY", "default" : false};
var ONE_WEEK_AGO =  {"name":"1 week ago", "value":"NOW-7DAY", "default" : false};
var TWO_WEEKS_AGO =  {"name":"2 weeks ago", "value":"NOW-14DAY", "default" : false};
var THREE_WEEKS_AGO =  {"name":"3 weeks ago", "value":"NOW-21DAY", "default" : false};
var ONE_MONTH_AGO =  {"name":"1 month ago", "value":"NOW-1MONTH", "default" : false};

// Select options for time ranges
var fromSelectOptions = [ ONE_MONTH_AGO, THREE_WEEKS_AGO, TWO_WEEKS_AGO, ONE_WEEK_AGO, TWO_DAYS_AGO, YESTERDAY, NOW ];
var toSelectOptions = [ NOW, YESTERDAY ,TWO_DAYS_AGO, ONE_WEEK_AGO, TWO_WEEKS_AGO, THREE_WEEKS_AGO, ONE_MONTH_AGO ];

var colors = d3.scale.category20();
keyColor = function(d, i) {return colors(d.key)};


var graphs = [
{ 
  'name' : 'Average Qtime',
  'tooltip' : 'Avg Qtime: ',
  'yLabel' : 'Avg QTime (ms)',
  'datumFunction'  : "fetchAvgData" ,
  'datumParam'  : "qtime" ,
  'chartId' : 'avgQtimeGraph',
  'type' : 'line'
 },
 { 
  'name' : 'Average number of queries',
  'tooltip' : 'Avg # queries: ',
  'yLabel' : 'Avg number of queries',
  'datumFunction'  : "fetchAvgData" ,
  'datumParam'  : "nqueries" ,
  'chartId' : 'avgQueriesGraph',
  'type' : 'line'

 },
 { 
  'name' : 'Avg queries on deck',
  'tooltip' : 'Avg queries on deck: ',
  'yLabel' : 'Avg queries on deck',
  'datumFunction'  : "fetchAvgData" ,
  'datumParam'  : "queriesOnDeck" ,
  'chartId' : 'avgQueriesDeckGraph',
  'type' : 'line'

 },
 { 
  'name' : 'Number of queries (integral)',
  'tooltip' : 'Number of queries (integral): ',
  'yLabel' : 'Number of queries (integral)',
  'datumFunction'  : "fetchIntegralData" ,
  'datumParam'  : "nqueries" ,
  'chartId' : 'integralQueriesGraph',
  'type' : 'line'

 },
 { 
  'name' : 'Number of queries',
  'tooltip' : 'Number of queries: ',
  'yLabel' : 'Number of queries',
  'datumFunction'  : "fetchCountData" ,
  'datumParam'  : ['exception', exceptionCountDetails ] ,
  'chartId' : 'exceptionCountGraph',
  'type' : 'line'

 },
 { 
  'name' : 'Query hits',
  'tooltip' : 'Number of queries: ',
  'yLabel' : 'Number of queries',
  'datumFunction'  : "fetchCountData" ,
  'datumParam'  : ['hits', hitsCountDetails ] ,
  'chartId' : 'queryHitsGraph',
  'type' : 'line'

 },
 { 
  'name' : 'Distribution of query times',
  'tooltip' : 'Number of queries: ',
  'yLabel' : 'Number of queries',
  'datumFunction'  : "fetchQtime" ,
  'datumParam'  : '' ,
  'chartId' : 'queryTimeDistributionGraph',
  'type' : 'stacked-area'

 }
];

var graphs_ready_to_render = [];


function prepareGraphs(graphs){
  graphs.forEach(function(graph){
    var chart;
    if (graph.type == 'line'){
        chart = nv.models.lineWithFocusChart().x(function (d) {
          return d.x;
        }).y(function (d) {
            return d3.round(d.y,2);
        }).tooltipContent(function(key, y, e, graph) { return  chart.tooltip + '<b>' + d3.round(e,2) + '</b><br/>' + 'Time: <b>' + y + '</b></br>'  })
        .width(800).height(500).color(keyColor);

        chart.xAxis.
          axisLabel('Timestamp').
            tickFormat(function (d) {
            return d3.time.format("%m/%d %H:%M:%S")(new Date(d));
        });
           chart.yAxis
          .axisLabel(chart.yLabel);
            
        var fetchData = window[graph.datumFunction];
        var data ;
        if (graph.datumParam instanceof Array) {
          data = fetchData(graph.datumParam[0],graph.datumParam[1]);
        } else data = fetchData(graph.datumParam);

        d3.select('#' + graph.chartId +' svg')
          .datum(data)
          .call(chart);

        nv.utils.windowResize(chart.update);
        graphs_ready_to_render.push(chart);


  } else if (graph.type == 'stacked-area'){
       chart = nv.models.stackedAreaChart()
                    .useInteractiveGuideline(true)
                    .x(function(d) { return d[0] })
                    .y(function(d) { return d[1] })
                    .color(keyColor)
                    .transitionDuration(300).width(800).height(500);

    //setting default style to expand
    chart.style("expand");

    chart.xAxis
        .tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });

    chart.yAxis
        .tickFormat(d3.format('d'));

      var fetchData = window[graph.datumFunction];
      var data = fetchData();

    d3.select('#' + graph.chartId)
      .datum(data)
      .transition().duration(0)
      .call(chart);
    nv.utils.windowResize(chart.update);
    graphs_ready_to_render.push(chart); 

   }
  });
  nv.addGraph(graphs_ready_to_render);
}

// from array of json get array of single element contained in the json
function getArrayOfElementsFromJsonArray(json, element){
  var array = [];
  for (var  i=0;i< json.length; i++){
    array.push(json[i][element]);
  }
  return array;
} 

function fetchCountData(toFetch, toFetchDetails) {
  var d = [];
  $.ajax({
    'url': 'http://localhost:3001/api/server/'+ server + '/core/'+ core +'/port/'+ port +'/start/' + start + '/end/' + end +'/count/'+ toFetch,
    'success': function(data) { /* process e.g. data.response.docs... */
      try {
        var json = JSON.parse(data);
        var entries = getArrayOfElementsFromJsonArray(toFetchDetails, "fieldName");
        var mappings = getArrayOfElementsFromJsonArray(toFetchDetails, "description");
        for (var j=0; j<entries.length;j++){
           entry = entries[j];
           var values = [];
           for (var  i=0;i< json.length; i++) values.push({ "x": fromSolrDateToUTC(json[i].masterTime_dt), "y": json[i][entry] } );
           d.push({"key": mappings[j], "values": values});
        }
      } catch(exception){}
    },
    async: false
  });
  return d;
}



function fetchQtime() {
  var d = [];
  $.ajax({
    'url': 'http://localhost:3001/api/server/'+ server + '/core/'+ core +'/port/'+ port +'/start/' + start + '/end/' + end +'/distribution/qtime',
    'success': function(data) { /* process e.g. data.response.docs... */
      try {
        var json = JSON.parse(data);

        var entries = getArrayOfElementsFromJsonArray(qtimeDistributionDetails, "fieldName");
        var mappings = getArrayOfElementsFromJsonArray(qtimeDistributionDetails, "description");

        for (var j=0; j<entries.length;j++){
              entry = entries[j];
               var values = [];
               for (var  i=0;i< json.length; i++) values.push([fromSolrDateToUTC(json[i].masterTime_dt), json[i][entry]]);
               d.push({"key": mappings[j], "values": values});
        }
      } catch(exception){}
    },
    async: false
  });
  return d;
}

function fetchAvgData(toFetch) {
  var d = [];
  $.ajax({
    'url': 'http://localhost:3001/api/server/'+ server + '/core/'+ core +'/port/'+ port +'/start/' + start + '/end/' + end +'/avg/' + toFetch,
    'success': function(data) { /* process e.g. data.response.docs... */
      try {
        var json = JSON.parse(data);
        for (var  i=0;i< json.length; i++){
         	//refactor this
         	if (toFetch == 'nqueries'){
              d.push({"x": fromSolrDateToUTC(json[i].masterTime_dt), "y": json[i]['tot-count_i'] } ); 
         	} 
         	if (toFetch == 'qtime'){
        	  d.push({"x": fromSolrDateToUTC(json[i].masterTime_dt), "y": json[i].avg_qtime_d } ); 
         	}
          if (toFetch == 'queriesOnDeck'){
            d.push({"x": fromSolrDateToUTC(json[i].masterTime_dt), "y": json[i].avg_requestsInProgress_d } );     
          }

        }
      } catch(exception){}
    },
    async: false
  });

  return [
    {
      area: true,
      values: d,
      key: "Avg " + toFetch,
    }
  ];
}



function fetchIntegralData(toFetch) {
  var d = [];
  $.ajax({
    'url': 'http://localhost:3001/api/server/'+ server + '/core/'+ core +'/port/'+ port +'/start/' + start + '/end/' + end +'/integral/'+ toFetch,
    'success': function(data) { /* process e.g. data.response.docs... */
      try {
        var json = JSON.parse(data);
        var values = [];
        for (var i=0; i<json.length;i++) values.push({ "x": fromSolrDateToUTC(json[i].masterTime_dt), "y": json[i]['tot-count_i'] } );
        d.push({"key": toFetch, "values": values});
      } catch(exception){console.log(exception);}
    },
    async: false
  });
  return d;
}



function selectValue(){
  var selectStart = document.getElementById("start");
  start = selectStart.options[selectStart.selectedIndex].value ;
  var selectEnd = document.getElementById("end");
  end = selectEnd.options[selectEnd.selectedIndex].value ;  
  server = document.getElementById("server").value;
  core = document.getElementById("core").value;
  port = document.getElementById("port").value;
  // Draw the graph
  prepareGraphs(graphs);
}



var fromSelect= document.getElementById('start');
for (var j=0; j<fromSelectOptions.length; j++) {
   var opt = document.createElement("option");
   opt.value= fromSelectOptions[j].value;
   opt.innerHTML = fromSelectOptions[j].name; 
   if (j == fromSelectOptions.length - 2) opt.selected = true;
   else opt.selected = false;
   fromSelect.appendChild(opt);
}

var toSelect= document.getElementById('end');
for (var j=0; j<toSelectOptions.length; j++) {
   var opt = document.createElement("option");
   opt.value= toSelectOptions[j].value;
   opt.innerHTML = toSelectOptions[j].name; 
   if (j == 0) opt.selected = true;
   else opt.selected = false;
   toSelect.appendChild(opt);

}

// transform solr date to UTC
function fromSolrDateToUTC(date){
    date = date.replace("Z", "");
    var year = date.split("T")[0].split("-")[0];
    var month = parseInt(date.split("T")[0].split("-")[1]-1);
    var day = date.split("T")[0].split("-")[2];
    var hour = date.split("T")[1].split(":")[0];
    var minutes = date.split("T")[1].split(":")[1];
    var seconds = date.split("T")[1].split(":")[2];
    return (new Date(Date.UTC(year,month,day,hour,minutes,seconds))).getTime();
}


	