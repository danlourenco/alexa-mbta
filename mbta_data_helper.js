'use strict';

var rp              = require('request-promise');
var _               = require('lodash');
var routesFile      = require('./api-responses/routes.json');

// CONSTANTS
var BASE_URL        = 'http://realtime.mbta.com/developer/api/v2/';
var URL_SUFFIX      = '?api_key=wX9NwuHnZU2ToO7GmGR9uw&format=json';
var FORMAT          = 'format=json';
var API_KEY         = 'wX9NwuHnZU2ToO7GmGR9uw'; // it's public; don't worry!
var ROUTES_ENDPOINT = `${BASE_URL}routes${URL_SUFFIX}`;
var routes          = routesFile.mode;

function MBTADataHelper() {}

MBTADataHelper.prototype.requestAllRoutes = function() {
  return this.getAllRoutes().then(function(response) {
    return response.body;
  });
};

MBTADataHelper.prototype.getAllRoutes = function() {
  return _makeRequest(ROUTES_ENDPOINT);
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
    return response.body;
  });
}

// Refactor to make generic request with endpoint and id as args
MBTADataHelper.prototype.getAllStopsByRoute = function(routeId) {
  const ALL_STOPS_BY_ROUTE_ENDPOINT = `${BASE_URL}stopsbyroute?api_key=${API_KEY}&route=${routeId}&${FORMAT}`;
  return _makeRequest(ALL_STOPS_BY_ROUTE_ENDPOINT);
}

MBTADataHelper.prototype.requestPredictionsByStop = function(stopId) {
  return this.getPredictionsByStop(stopId).then(function(response) {
    return response.body;
  });
}

MBTADataHelper.prototype.getPredictionsByStop = function(stopId) {
  const PREDICTIONS_BY_STOP_ENDPOINT = `http://realtime.mbta.com/developer/api/v2/predictionsbystop?api_key=wX9NwuHnZU2ToO7GmGR9uw&stop=${stopId}&format=json`;
  return _makeRequest(PREDICTIONS_BY_STOP_ENDPOINT);
}

MBTADataHelper.prototype.formatPrediction = function(stopResponse) {
  let stopName = stopResponse.stop_name;
  let tripData = stopResponse.mode[0].route[0].direction[0].trip;
  let destination = tripData[0].trip_headsign;
  // let predictedTimeOfArrival = tripData[0].pre_dt;
  let predictedTimeInSeconds = tripData[0].pre_away;
  let minutes = Math.floor(predictedTimeInSeconds / 60);
  let seconds = predictedTimeInSeconds % 60;
  return `The next train to ${destination} from ${stopName} departs in ${minutes} minutes and ${seconds} seconds.`;
}

// Helper function
function _makeRequest(uri) {
  var options = {
    method: 'GET',
    uri: uri,
    resolveWithFullResponse: true,
    json: true
  };
  return rp(options);
}

module.exports = MBTADataHelper;
