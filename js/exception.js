var graphs=[];

// Default server infos
var server = "";
var pool = "";
var core = "";
var port = "";
var start = "";
var end = "";
var nresults = "";
var page = "";


function fetch(toFetch){
  var d = [];
  $.ajax({
    'url': 'http://localhost:3001/api/server/'+ server + '/core/'+ core +'/port/'+ port +'/start/' + start + '/end/' + end +'/list/exception/page/0/step/10',
    'success': function(data) { /* process e.g. data.response.docs... */
     console.log(data);
    },
    async: false
  });
  return d;  
}

function prepareGraphs(){
  fetch('test');
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


  
function selectValue(){
  var areAllParamsFilled = true;

  clearFillingError();
  start = document.getElementById("datetimepickerStart").value;
  if (start == '') areAllParamsFilled = false;
  start = start.replace(' ','T') +'Z';
  end = document.getElementById("datetimepickerEnd").value;
  if (end == '') areAllParamsFilled = false;
  end = end.replace(' ','T') +'Z';
  if (document.getElementById("server") != null ) server = document.getElementById("server").value;    
  if (document.getElementById("pool") != null ) pool = document.getElementById("pool").value;
  if (pool =='' && server =='') areAllParamsFilled = false;
  core = document.getElementById("core").value;
  if (core == '') areAllParamsFilled = false;
  port = document.getElementById("port").value;
  if (port == '') areAllParamsFilled = false;

  // page = document.getElementById("page").value;
  // if (page == '') areAllParamsFilled = false;

  // nresults = document.getElementById("nresults").value;
  // if (nresults == '') areAllParamsFilled = false;
  page = 0;
  nresults = 5;
  

  // if (areAllParamsFilled == false){
  //   handleFillingError();
  // } else

  fetchExceptionList();
}


//TODO: refactor fetch functions
function fetchExceptionList() {
  console.log('http://localhost:3001/api/list/'+ server + '/core/'+ core +'/port/'+ port +'/start/' + start + '/end/' + end +'/page/'+ page+'/nresults/' + nresults);
  //       
  // var d = [];
  // $.ajax({
  //   'url': 'http://localhost:3001/api/list/'+ server + '/core/'+ core +'/port/'+ port +'/start/' + start + '/end/' + end +'/page/'+ page+'/nresults/' + nresults,
  //   'success': function(data) { /* process e.g. data.response.docs... */
  //     try {
  //       console.log('http://localhost:3001/api/list/'+ server + '/core/'+ core +'/port/'+ port +'/start/' + start + '/end/' + end +'/page/'+ page+'/nresults/' + nresult);
  //       var json = JSON.parse(data);
  //       console.log(json);
  //       // var entries = getArrayOfElementsFromJsonArray(toFetchDetails, "fieldName");
  //       // var mappings = getArrayOfElementsFromJsonArray(toFetchDetails, "description");
  //       // for (var j=0; j<entries.length;j++){
  //       //    entry = entries[j];
  //       //    var values = [];
  //       //    for (var  i=0;i< json.length; i++) values.push({ "x": fromSolrDateToUTC(json[i].masterTime_dt), "y": json[i][entry] } );
  //       //    d.push({"key": mappings[j], "values": values});
  //       // }
  //     } catch(exception){}
  //   },
  //   async: false
  // });
  // return d;
}  