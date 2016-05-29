'use strict';

var rp              = require('request-promise');
var _               = require('lodash');
var routesFile      = require('./routes.json');
var stopsFile       = require('./stops.json');

// CONSTANTS
var BASE_URL        = 'http://realtime.mbta.com/developer/api/v2/';
var URL_SUFFIX      = '?api_key=wX9NwuHnZU2ToO7GmGR9uw&format=json';
var FORMAT          = 'format=json';
var API_KEY         = 'wX9NwuHnZU2ToO7GmGR9uw' ;
var ROUTES_ENDPOINT = `${BASE_URL}routes${URL_SUFFIX}`;

var routes          = routesFile.mode;

function MBTADataHelper() {}

MBTADataHelper.prototype.requestAllRoutes = function() {
  return this.getAllRoutes().then(function(response) {
    console.log('success - received all routes');
    return response.body;
  });
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

// refactor to deep search through a generic collection
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

MBTADataHelper.prototype.requestAllStopsByRoute = function(routeId) {
  return this.getAllStopsByRoute(routeId).then(function(response) {
    console.log('success - received all stops');
    return response.body;
  });
}

MBTADataHelper.prototype.getAllStopsByRoute = function(routeId) {
  let ALL_STOPS_BY_ROUTE_ENDPOINT = `${BASE_URL}stopsbyroute?api_key=${API_KEY}&route=${routeId}&${FORMAT}`;
  var options = {
    method: 'GET',
    uri: ALL_STOPS_BY_ROUTE_ENDPOINT,
    resolveWithFullResponse: true,
    json: true
  };
  return rp(options);
}

MBTADataHelper.prototype.requestPredictionsByStop = function(stopId) {
  return this.getPredictionsByStop(stopId).then(function(response) {
    console.log('success - received predictions by stop');
    return response.body;
  });
}

MBTADataHelper.prototype.getPredictionsByStop = function(stopId) {
  let PREDICTIONS_BY_STOP_ENDPOINT = `http://realtime.mbta.com/developer/api/v2/predictionsbystop?api_key=wX9NwuHnZU2ToO7GmGR9uw&stop=${stopId}&format=json`;
  var options = {
    method: 'GET',
    uri: PREDICTIONS_BY_STOP_ENDPOINT,
    resolveWithFullResponse: true,
    json: true
  };
  return rp(options);
}

module.exports = MBTADataHelper;
