var thothApi = {
  _uri : 'localhost:3001/api/',
  getUri: function (params) {

    var urlParams = [params.objectId, (params.server == undefined)? params.pool : params.server , 'core', params.core, 'port', params.port, 'start', params.from_date, 'end', params.to_date, params.attribute, params.endpoint, (params.page ==  undefined)? "" : params.page ];
    var url = 'http://' + thothApi._uri + urlParams.join('/');
    return url;
  },

  //Query a list of options for a specific param
  //e.g: http://localhost:3001/api/list/servers returns {search501, search502, search503..etc}
  getParamsListUri: function(param) {
    return 'http://' + thothApi._uri + 'list/' + param;
  }
};
