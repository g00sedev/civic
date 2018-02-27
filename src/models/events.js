import _ from 'lodash';
import uuid from 'uuid';

import {
  postEventDb
} from '../db/events.js';
import {
  buildInternalServerError
} from '../helpers/errors.js';

export function postEvent(event, callback) {
  if (isValid(event)) {
    event.eventId = uuid.v4();
    postEventDb(event, function(err, resp) {
      if (err) {
        callback([buildInternalServerError('unknown db error')]);
      } else {
        callback(null, {
          response: 'success'
        });
      }
    });
  } else {
    callback([buildInternalServerError('unknown error')]);
  }
}

function isValid(event) {
  if (!event.userId || !event.at || !_.isBoolean(event.threshold)) {
    return false;
  }
  if (!_.isString(event.userId) || !_.isString(event.at)) {
    return false;
  }
  return true;
}