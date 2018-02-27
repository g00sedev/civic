import _ from "lodash";

const errorCodes = {
  "Internal Server Error": 500,
  "Bad Request": 400,
  "Resource Not Found": 404,
  "Unauthorized": 401,
  "Conditional Check Failed Exception": 400,
  "No Content": 204
};

function errorBuilder(errorObject, callback) {
  var title = _.get(errorObject, "title", "Internal Server Error");
  var status = _.toString(_.get(errorCodes, title, 500));
  var detail = _.get(errorObject, "detail", "Unknown error occurred");
  var pointer = errorObject.pointer;
  var source = {};
  var error = {};

  if (_.has(errorObject, "pointer")) {
    source.pointer = errorObject.pointer;
  }

  if (_.has(errorObject, "attributes")) {
    source.body = {
      attributes: errorObject.attributes
    };
  }

  if (!_.isEmpty(source)) {
    error = {
      status: status,
      source: source,
      title: title,
      detail: detail
    };
  } else {
    error = {
      status: status,
      title: title,
      detail: detail
    };
  }
  return error;
}



export function buildError(readOnlyErrorArray, pointer, callback) {
  var errorArray = _.map(readOnlyErrorArray, function(obj) {
    if (pointer !== null) {
      return _.merge(obj, {
        pointer
      });
    }
    return obj;
  });

  console.log('errorArray:', errorArray);
  console.log('title:', _.get(errorArray, '[0].title'));
  if (_.isEmpty(errorArray)) {
    errorArray.push({
      title: 'Internal Server Error',
      detail: 'Unknown error occurred'
    });
  }
  var errorCode = _.get(errorCodes, _.get(errorArray, '[0].title'), 500);
  callback(null, {
    status: errorCode,
    errors: _.map(errorArray, errorBuilder)
  });
}

export function buildBadRequestError(attributes, errorMessage) {
  return {
    attributes: attributes,
    title: 'Bad Request',
    detail: errorMessage
  };
}

export function buildBadRequestErrorNoAtts(msg) {
  return {
    title: 'Bad Request',
    detail: msg
  };
}

export function buildInternalServerErrorDynamoDb() {
  return {
    title: 'Internal Server Error',
    detail: 'Error occurred while making a request to DynamoDB'
  };
}

export function buildInternalServerError(msg) {
  return {
    title: 'Internal Server Error',
    detail: msg
  };
}

export function buildResourceNotFound(msg) {
  return {
    title: 'Resource Not Found',
    detail: msg
  };
}

export function buildNoContent(msg) {
  return {
    title: "No Content",
    detail: msg
  };
}

export function buildUnauthorized(msg) {
  return {
    title: "Unauthorized",
    detail: msg
  };
}