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
    'slow_queries' : [
      'port',
      'core'
    ],
    'realtime'     : [
      'port',
      'core'
    ]
};

function populateForm (activeView) {

  var list = [];

  //Clean params, hide all select
  var $formParams = $('form>select');
  $.each($formParams, function () {
    $(this).hide();
    $(this).prev('label').hide();
  });

  form_options[activeView].forEach(function (param) {
      //TODO get better with this pluralization
      $.getJSON(thothApi.getParamsListUri(param + 's'), function (data) {
        list = data.list;

        // Find the correct select element and show it, with its label
        var $select = $('[data-role=' + param + '-values-select]');
        //debugger;
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

function displayParamsForView (activeView, param) {
  form_options['all'].forEach(function (param){

  })
}