'use strict';

var _               = require('lodash');
var MBTADataHelper  = require('./mbta_data_helper');

var Alexa = require('alexa-app');
var app   = new Alexa.app('alexa-mbta'); // what skill will be known as in alexa-app-server context
module.change_code = 1; // for alexa-app node module we're using for development

// the following method is automatically triggered any time this skill is invoked
app.launch(function(req, res) {
  var prompt = 'For next predicted MBTA stop, give me a stop ID.';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

app.intent('mbtapredictions', {
  'slots': {
    'STOPID': 'MBTASTOPIDS'
  },
  'utterances': ['{|T|MBTA|Train} {|prediction} {|for} {-|STOPID}']
},
function(req, res) {
  var stopID = req.slot('STOPID');
  var reprompt = 'Give me an MBTA stop ID to get prediction info';

  if (_.isEmpty(stopID)) {
    var prompt = 'I didn\'t hear a stop ID.  Please tell me a stop ID.';
    res.say(prompt).reprompt(reprompt).shouldEndSession(false);
    return true;
  } else {
    var mbtaHelper = new MBTADataHelper();

    mbtaHelper.requestPredictionsByStop(stopID).then(function(predictionResponse) {
      console.log(predictionResponse);
      res.say(mbtaHelper.formatPrediction(predictionResponse)).send();
    }).catch(function(err) {
      console.log(err.statusCode);
      var prompt = 'I didn\'t have data for a stop ID of ' + predictionResponse;
      res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
    });
    return false;
  }
}
);
// })

module.exports = app;
