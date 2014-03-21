// Default server infos
var server = "";
var pool = "";
var core = "";
var port = "";
var start = "";
var end = "";


  jQuery(function($){
    $('#datetimepickerStart').datetimepicker({
      format:'Y-m-d h:i:s'
    });

    $('#datetimepickerEnd').datetimepicker({
      format:'Y-m-d h:i:s'
    });
  });

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

  if (areAllParamsFilled == false){
    handleFillingError();
  } else
  // Draw the graph
  prepareGraphs(graphs);
}

function clearFillingError(){
 document.getElementById('notFound').style.display = "none";
 document.getElementById('notFoundNav').style.display = "none";

}

function handleFillingError(){
 document.getElementById('notFound').style.display = "block";
 document.getElementById('notFoundNav').style.display = "block";

}