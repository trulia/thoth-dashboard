/* globals nv, d3, thothApi, chartsData, realtime, graphBuilder */
/* exported thoth */

var formParams = [];

/**
 * Show right form and data box while hiding the other forms/data boxes
 */
function showFormAndData(objectId){
  ['servers', 'pools', 'realtime', 'slowqueries', 'exceptions'].forEach(function(data){
    if (objectId === data) {
      $('#' + data).show();
    } else {
      $('#' + data).hide();
    }
  });
}

/**
 * Return a qtime in mseconds or seconds depending on the quantity in:
 * qtime in ms
 *
 * @param qtime
 * @returns {string}
 */
function formatQtime(qtime){
  if (qtime > 1000) {
    // more than 1 sec, return secs
    return (qtime / 1000) + ' s';
  } else {
    // less than 1 sec, return ms
    return qtime + ' ms';
  }
}

/**
 * setDefaultFromAndToDates
 * Set default dates in the forms. From : Yesterday , To: Tomorrow
 */
function setDefaultFromAndToDates(){
  var today = new Date(); var yesterday = new Date();
  // Set yesterday date
  yesterday.setDate(yesterday.getDate() - 1);
  // Set both yesterday and today dates in the right string format
  var todayStr = today.getFullYear() + '/' + ('00'+ (today.getMonth()+1)).slice(-2) + '/' + ('00'+ (today.getDate()+1)).slice(-2) + ' ' + '12:00:00';
  var yesterdayStr = yesterday.getFullYear() + '/' + ('00'+ (yesterday.getMonth()+1)).slice(-2) + '/' + ('00'+ yesterday.getDate()).slice(-2) + ' ' + '12:00:00';
  // Add date values if they are not already filled in the form
  if (getParamValue('from') == null)  $('[data-role=from_date_input]').val(yesterdayStr);
  else $('[data-role=from_date_input]').val(getParamValue('from'));

  if (getParamValue('to') == null)  $('[data-role=to_date_input]').val(todayStr);
  else  $('[data-role=to_date_input]').val(getParamValue('to'));
}

/**
 * getParamsFromQueryString
 * Retrieve the params from query string
 * @return array of params, empty array if landing page
 */
function getParamsFromQueryString(){
  var params = location.href.split('?')[1];
  var formParams = [];

  if (params != undefined) {  // not landing page
    var splittedParam = params.split('&');
    splittedParam[0] = splittedParam[0].replace('/', ''); // Remove the '/' from the page value
    splittedParam.forEach(function(e){
      var val = decodeURIComponent(e.split("=")[1]).replace(/"/g,'');
      if (val[val.length-1] == '/') val = val.substr(0, val.length-2); // Remove the '/' from the last param value
      formParams.push({ name: e.split("=")[0], value: val}); // Store param and value in formParams array
    });
  }
  return formParams;
}

/**
 * getParamValue
 * Return value from param stored in the formParams array
 * @param  paramName name
 * @return value or null if param does not exist
 */
function getParamValue(paramName){
  for(var i=0; i < formParams.length; i++){
    if (formParams[i].name == paramName) return formParams[i].value;
  }
  return null;
}

/**
 * initializeDatetimePickers
 * Initialize jquery datetime pickers and set default dates value
 */
function initializeDatetimePickers(){
  $('[data-role=from_date_input], [data-role=to_date_input]').datetimepicker({
    format: 'Y/m/d h:i:s'
  });
  setDefaultFromAndToDates();
}

/**
 * getSelectedParamValue
 * Retrieve selected option from dropdown select
 * @param paramId id
 * @return value
 */
function getSelectedParamValue(paramId){
  return $('#' + paramId + ' option:selected').val();
}

/**
 * updateQueryStringFromForm
 * Generate a new query string from the form and returns it
 * @return query string
 */
function updateQueryStringFromForm(){

  var $formParams           = $('form select');
  var poolParamIsVisible   = $($formParams[1]).is(':visible');

  var isServerPage      = getParamValue('p') === 'servers';
  var isSlowqueriesPage = getParamValue('p') === 'slowqueries';
  var isExceptionsPage  = getParamValue('p') === 'exceptions';
  var isRealTime        = getParamValue('p') === 'realtime';

  var queryString = '?';
  if (isServerPage) queryString += 'p=servers&server=' + '"' + getSelectedParamValue($formParams[0].id) + '"';
  if (poolParamIsVisible) queryString += 'p=pools&pool=' + '"' + getSelectedParamValue($formParams[1].id) + '"';
  if (isSlowqueriesPage) queryString += 'p=slowqueries&server=' + '"' + getSelectedParamValue($formParams[0].id) + '"';
  if (isExceptionsPage) queryString += 'p=exceptions&server=' + '"' + getSelectedParamValue($formParams[0].id) + '"';
  if (isRealTime) queryString += 'p=realtime&server=' + '"' + getSelectedParamValue($formParams[0].id) + '"';
  queryString += '&port=' + '"' + getSelectedParamValue($formParams[2].id) + '"';
  queryString += '&core=' + '"' + getSelectedParamValue($formParams[3].id) + '"' ;
  queryString += '&from=' + '"' + $('[data-role=from_date_input]').val().replace(/ /g,'%20') + '"';
  queryString += '&to=' + '"' + $('[data-role=to_date_input]').val().replace(/ /g,'%20') + '"';

  return queryString;
}

function hideFormFields(){
  var elements = [$('[data-role=to_date_input]'), $('[data-role=from_date_input]'), $('[for=from_date]'), $('[for=to_date]'), $('[data-role=share_url]'), $('[data-role=submit_settings]')];
  elements.forEach(function(el){
    $(el).hide();
  });
}

function showFormFields(){
  var elements = [$('[data-role=to_date_input]'), $('[data-role=from_date_input]'), $('[for=from_date]'), $('[for=to_date]'), $('[data-role=share_url]'), $('[data-role=submit_settings]')];
  elements.forEach(function(el){
    $(el).show();
  });
}

/**
 * Change class for left menu link if page is selected
 */
function activateMenuLink(){

  var $li = $('#menu li');
  $li.removeClass('active');
  if (getParamValue('p') != null) {
    // populateForm(getParamValue('p'));
    var index;
    if ('servers' === getParamValue('p')) index = 0;
    if ('pools' === getParamValue('p')) index = 1;
    if ('exceptions' === getParamValue('p')) index = 2;
    if ('slowqueries' === getParamValue('p')) index = 3;
    if ('realtime' === getParamValue('p')) index = 4;

    $($li[index]).addClass('active');
  }
}


// APPLICATION START
$('document').ready(function () {

  // Bind events to the button
  $('[data-role=submit_settings]').on('click', function (event) {
    event.preventDefault();
    document.location =  updateQueryStringFromForm();
  });

  $('[data-role=share_url]').on('click', function (event) {
    event.preventDefault();
    alert("Share this URL: \n\n" + document.location.href);
  });

  formParams = getParamsFromQueryString();
  initializeDatetimePickers();
  if (getParamValue('p') === null) {
    hideFormFields();
  } else {
    if (getParamValue('p') === 'realtime') {
      if (realtime.socket) {
        realtime._sendNewData();
      }
    }
    showFormFields();
    populateForm(getParamValue('p'));
  }
  showFormAndData(getParamValue('p'));
  activateMenuLink();
});