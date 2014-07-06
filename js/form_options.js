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
      'port',
      'core'
    ],
    'slow queries' : [
      'server',
      'port',
      'core'
    ],
    'realtime'     : [
      'port',
      'core'
    ]
};

//Step1: hide all the selects
//Step2: for the given activeView params (e.g. server, port, core),
// fetch a list of options and populate each select
function populateForm (activeView) {

  var list = [];


  //Clean params, hide all the select
  var $formParams = $('form>select');
  $.each($formParams, function () {
    $(this).hide();
    $(this).prev('label').hide();
  });

  form_options[activeView].forEach(function (param) {
      //TODO get better with this pluralization
      $.getJSON(thothApi.getParamsListUri(param + 's'), function (data) {
        list = data.list.sort();

        //Find the correct select element and show it, with its label
        var $select = $('[data-role=' + param + '-values-select]');
        //Show selected select only
        $select.prev('label').show();
        $select.show();

        // Append options to select element
        var key, val;
        for (key in list) {
          if (list.hasOwnProperty(key)) {
            val = list[key];
            $('<option/>').val(val).text(val).appendTo($select);
          }
        }
      })
    }
  );
}