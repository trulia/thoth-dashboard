/**
 * Params we want to have in the header form
 */
var form_options = {
  'servers'      : [
    'server',
    'port',
    'core'
  ],
  'pools'        : [
    'pool',
    'port',
    'core'
  ],
  'exceptions'   : [
    'server',
    'port',
    'core'
  ],
  'slow queries' : [
    'server',
    'port',
    'core'
  ],
  'realtime'     : [
    'server',
    'port',
    'core'
  ]
};

/**
 * Populate the decided select gathering data from the API
 * @param param name of the select to populate
 * @return callback
 */
function populateSelect(param){
  return $.getJSON(thothApi.getParamsListUri(param + 's'), function (data) {
    var list = data.list.sort();
    //Find the correct select element and show it, with its label
    var $select = $('[data-role=' + param + '_values_select]');
    //Show selected select only
    $select.prev('label').show();
    $select.show();
    // Append options to select element
    var key, val;
    for (key in list) {
      if (list.hasOwnProperty(key)) {
        val = list[key];
        if (getParamValue(param) != null && getParamValue(param) == val){
          $('<option selected />').val(val).text(val).appendTo($select);
        } else  $('<option/>').val(val).text(val).appendTo($select);
      }
    }
    return null;
  });
}




//Step1: hide all the selects
//Step2: for the given activeView params (e.g. server, port, core),
// fetch a list of options and populate each select
function populateForm (activeView) {
  var list = [];
  //Clean params, hide all the select
  var $formParams = $('form select');
  $.each($formParams, function () {
    $(this).hide();
    $(this).prev('label').hide();
  });

  var pageToPopulate;
  if (activeView === 'servers') pageToPopulate = populateSelect('server');
  if (activeView === 'pools') pageToPopulate = populateSelect('pool');
  if (activeView === 'slowqueries') pageToPopulate = populateSelect('server');
  if (activeView === 'exceptions') pageToPopulate = populateSelect('server');
  if (activeView === 'realtime') pageToPopulate = populateSelect('server');

  $.when(pageToPopulate, populateSelect('port'), populateSelect('core')).done(function(){
    thoth[activeView]();
  });

}