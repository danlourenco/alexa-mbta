'use strict';
var rp = require('request-promise');
var _ = require('lodash');

var ROUTES_ENDPOINT = 'http://realtime.mbta.com/developer/api/v2/routes?api_key=wX9NwuHnZU2ToO7GmGR9uw&format=json';

var STOPS_BY_ROUTE_ENDPOINT = 

var routesFile = require('./routes.json');
var routes = routesFile.mode;

function MBTADataHelper() {}

MBTADataHelper.prototype.requestAllRoutes = function() {
  return this.getAllRoutes().then(function(response) {
    console.log('success - received all routes');
    return response.body;
  })
};

MBTADataHelper.prototype.getAllRoutes = function() {
  var options = {
    method: 'GET',
    uri: ROUTES_ENDPOINT,
    resolveWithFullResponse: true,
    json: true
  };
  return rp(options);
};

MBTADataHelper.prototype.findRouteIdByName = function(obj, name) {
  var arr = [];
  for (var i = 0; i < routes.length; i++) {
    arr.push(routes[i].route);
    var flattened = arr.reduce(function(a, b) {
      return a.concat(b);
    }, []);
  }
  var match = _.find(flattened, {route_name: name});
  return match.route_id;
};

module.exports = MBTADataHelper;
