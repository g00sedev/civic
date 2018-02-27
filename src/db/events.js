import {
  loadConfig
} from '../helpers/config.js';
import {
  getDocClient
} from './dynamodb_client.js';
import _ from 'lodash';

var config = loadConfig();

export function postEventDb(event, callback) {
  var params = {
    TableName: _.get(config, 'dynamodb.tables.events'),
    Item: event,
    ReturnValues: "ALL_OLD"
  };
  getDocClient().put(params, (err, resp) => {
        callback(err, _.get(resp, 'Item', {}));
  });
}
