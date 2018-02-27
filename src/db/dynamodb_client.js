
import _ from 'lodash';
import AWS from 'aws-sdk';
import {
  loadConfig
} from '../helpers/config.js';

var config = loadConfig(process.env.NODE_ENV);
var docClient = null;

export function getDocClient() {
  if (!docClient) {
    docClient = new AWS.DynamoDB.DocumentClient({
      region: _.get(config, 'dynamodb.region')
    });
  }
  return docClient;
}

// use in testing
export function setDocClient(client) {
  docClient = client;
}