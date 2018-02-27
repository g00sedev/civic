import {
  buildError,
  buildUnauthorized
} from './errors.js';
import _ from 'lodash';

export function asArray(a) {
  if (_.isArray(a)) {
    return a;
  }
  return [a];
}

export function responseHandler(req, res, path) {
  return function(error, response) {
    if (error) {
      buildError(asArray(error), path, function(err, resp) {
        res.status(resp.status).json({
          errors: resp.errors
        });
      });
    } else {
      res.set({ "Content-Type": "application/vnd.api+json" });
      res.json({
        data: response
      });
    }
  };
}

export function errorResponseHandler(req, res, path, error) {
  buildError(asArray(error), path, function(err, resp) {
    res.status(resp.status).json({
      errors: resp.errors
    });
  });
}


export function checkSharedRole(req, paramWicketId) {
  if (_.includes(req.roles, 'shared') && (req.wicketId !== paramWicketId)) {
    return [buildUnauthorized('User is not authorized to perform this action')];
  } else {
    return [];
  }
}

export function builtErrorOrResp(err, resp, callback, builtError) {
  if(err) {
    callback(builtError);
  } else {
    callback(null, resp);
  }
}
