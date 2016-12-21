'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = (event, context, callback) => {
  console.log(event);
  var startKey = null;
  var query = event.queryStringParameters;
  if (query &&
      query.hasOwnProperty('id') &&
      query.hasOwnProperty('createdMonth') &&
      query.hasOwnProperty('createdAt')) {
    startKey = {
      id: query.id,
      createdMonth: query.createdMonth,
      createdAt: Number(query.createdAt)
    };
  }
  console.log(startKey);

  const params = {
    TableName: 'shareImages',
    IndexName: 'globalIndex1',
    Limit: 5,
    ScanIndexForward : false,     // order by RANGE key desc
    ExclusiveStartKey: startKey,  // paging
    KeyConditionExpression : "#k = :val",
    ExpressionAttributeValues : {":val" : "201612"},  // ToDo avoid hardcoding
    ExpressionAttributeNames  : {"#k" : "createdMonth"}
  };

  // query share image info from the database
  dynamoDb.query(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error); // eslint-disable-line no-console
      callback(new Error('Couldn\'t fetch the shareImages.'));
      return;
    }

    // create a resonse
    const response = {
      statusCode: 200,
      body: JSON.stringify(result),
    };
    callback(null, response);
  });
};
