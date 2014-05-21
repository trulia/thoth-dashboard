var thothApi = {
  _uri : 'localhost:3001/api/',
  getUri: function (params) {
    var urlParams = [params.objectId, params.server, 'core', params.core, 'port', params.port, 'start', params.from_date, 'end', params.to_date, params.attribute, params.endpoint];
    var url = 'http://' + thothApi._uri + urlParams.join('/');
    return url;
  }
};


