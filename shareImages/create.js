'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.imageUrl !== 'string' && typeof data.title !== 'string') {
    console.error('Validation Failed'); // eslint-disable-line no-console
    callback(new Error('Couldn\'t create the shareImage item.'));
    return;
  }

  const params = {
    TableName: 'shareImages',
    Item: {
      id: uuid.v1(),
      createdAt: timestamp,
      createdMonth: '201612', // todo: calculate programatically
      title: data.title,
      imageUrl: data.imageUrl,
      updatedAt: timestamp,
    },
  };

  // write the share image info to the database
  dynamoDb.put(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error); // eslint-disable-line no-console
      callback(new Error('Couldn\'t create the shareImage item.'));
      return;
    }

    // create a resonse
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
    callback(null, response);
  });
};
