
var exceptionCountDetails = [{ "fieldName": "exceptionCount_i", "description" : "Number of exceptions"}, {"fieldName": "tot-count_i", "description" : "Total number of queries"} ];
var hitsCountDetails = [{ "fieldName": "zeroHits-count_i", "description" : "Queries with 0 hits"}, {"fieldName": "tot-count_i", "description" : "Total number of queries"} ];
var qtimeDistributionDetails =  [{ "fieldName": "range-0-10_i", "description" : "Between 0 and 10 ms"}, {"fieldName": "range-10-100_i", "description" : "Between 10 and 100 ms"},{"fieldName": "range-100-1000_i", "description": "Between 100 and 1000 ms"}, {"fieldName": "range-1000-OVER_i", "description": "Over 1000 ms"} ];

var colors = d3.scale.category20();
keyColor = function(d, i) {return colors(d.key)};


var graphs = [
{ 
  'name' : 'Average Qtime',
  'tooltip' : 'Avg Qtime: ',
  'yLabel' : 'Avg QTime (ms)',
  'datumFunction'  : "fetch" ,
  'datumParam'  : "avg/qtime" ,
  'chartId' : 'avgQtimeGraph',
  'type' : 'line'
 },
 { 
  'name' : 'Average number of queries',
  'tooltip' : 'Avg # queries: ',
  'yLabel' : 'Avg number of queries',
  'datumFunction'  : "fetch" ,
  'datumParam'  : "avg/nqueries" ,
  'chartId' : 'avgQueriesGraph',
  'type' : 'line'

 },
 { 
  'name' : 'Avg queries on deck',
  'tooltip' : 'Avg queries on deck: ',
  'yLabel' : 'Avg queries on deck',
  'datumFunction'  : "fetch" ,
  'datumParam'  : "avg/queriesOnDeck" ,
  'chartId' : 'avgQueriesDeckGraph',
  'type' : 'line'

 },
 { 
  'name' : 'Number of queries (integral)',
  'tooltip' : 'Number of queries (integral): ',
  'yLabel' : 'Number of queries (integral)',
  'datumFunction'  : "fetch" ,
  'datumParam'  : "integral/nqueries" ,
  'chartId' : 'integralQueriesGraph',
  'type' : 'line'

 },
 { 
  'name' : 'Number of queries',
  'tooltip' : 'Number of queries: ',
  'yLabel' : 'Number of queries',
  'datumFunction'  : "fetch" ,
  'datumParam'  : ['count/exception', exceptionCountDetails ] ,
  'chartId' : 'exceptionCountGraph',
  'type' : 'line'

 },
  { 
  'name' : 'Number of exceptions (integral)',
  'tooltip' : 'Number of exceptions (integral): ',
  'yLabel' : 'Number of exceptions (integral)',
  'datumFunction'  : "fetch" ,
  'datumParam'  : "integral/exception" ,
  'chartId' : 'integralExceptionGraph',
  'type' : 'line'

 },
 { 
  'name' : 'Query hits',
  'tooltip' : 'Number of queries: ',
  'yLabel' : 'Number of queries',
  'datumFunction'  : "fetch" ,
  'datumParam'  : ['count/hits', hitsCountDetails ] ,
  'chartId' : 'queryHitsGraph',
  'type' : 'line'

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
         
                 chart.x2Axis.
          axisLabel('Timestamp').
            tickFormat(function (d) {
            return d3.time.format("%H:%M")(new Date(d));
        });

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
        document.getElementById(graph.chartId).style.visibility = "visible";
  }});
  nv.addGraph(graphs_ready_to_render);
}

function fetch(toFetch){
  var d = [];
  $.ajax({
    'url': 'http://localhost:3001/api/pool/'+ pool + '/core/'+ core +'/port/'+ port +'/start/' + start + '/end/' + end +'/' + toFetch,
    'success': function(data) { /* process e.g. data.response.docs... */
     d = jsonApiToArray(data);
    },
    async: false
  });
  return d;  
}

function jsonApiToArray(data){
  var d = [];
  try {
    var json = JSON.parse(data);
    for (var  i=0;i< json.length; i++){
      var arr = [];
       json[i].values.value
      for (var j=0; j<json[i].values.length; j++){
        arr.push({ "x": fromSolrDateToUTC(json[i].values[j].timestamp), "y": json[i].values[j].value});
      }
      d.push({"key": json[i].hostname, "values": arr, "area": false});
    }
    return d;
  } catch(exception){}
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


	