'use strict';
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var MBTADataHelper = require('../mbta_data_helper');
var routes = require('../routes');
var stops = require('../stops');

chai.config.includeStack = true;

describe('MBTADataHelper', function() {
  var subject = new MBTADataHelper();

  describe('#getAllRoutes', function() {
    // Fix this test and figure out how to compare JSON file to REAL JSON request
    context('with a valid request', function() {
      it('returns a list of all MBTA routes', function() {
        var myRoutes = subject.requestAllRoutes().then(function(response) {
          return response;
        });
        return expect(myRoutes).to.exist;
      });
    });
  });

  describe('#findRouteIdByName', function() {
    var subject = new MBTADataHelper();
    context('with a valid name', function() {
      it('returns the appropriate route_id', function() {
        var routeId = subject.findRouteIdByName(routes, 'Green Line E');
        return expect(routeId).to.eq('Green-E');
      });
    });
  });

  describe('#getAllStopsByRoute', function() {
    var subject = new MBTADataHelper();
    context('with a valid route ID', function() {
      it('returns a list of all stops (by route)', function() {
        var stopId = 'Green-C';
        var stop = subject.requestAllStopsByRoute(stopId).then(function(response) {
          return response.direction[1].stop[0].stop_name;
        });
        return expect(stop).to.eventually.equal('Cleveland Circle - Inbound');
      });
    });
  });

  describe('#getPredictionsByStop', function() {
    var subject = new MBTADataHelper();
    context('#with a valid stop ID', function() {
      it('returns a list of predictions for the next hour', function() {
        var stopId = 70224;
        var stopName = subject.requestPredictionsByStop(stopId).then(function(response) {
          return response.stop_name;
        });
        return expect(stopName).to.eventually.eq('Summit Avenue - Inbound');
      });
    });
  });
});
