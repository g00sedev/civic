import {
  responseHandler
} from '../helpers/http_helper.js';
import {
  postEvent
} from '../models/events.js';
import _ from 'lodash';
import express from 'express';

var router = express.Router();

router.post('/', function(req, res) {
  var event = _.get(req, 'body.attributes', {});
  console.log("body", req.body);
  console.log("event", event);
  postEvent(event, responseHandler(req, res, '/events'));
});

// router.get('/', checkAuthHeader, function(req, res) {
//   var authToken = _.get(req, 'headers.authorization');
//   getUserSessionInfo(authToken, responseHandler(req, res, '/sessions'));
// });


module.exports = router;