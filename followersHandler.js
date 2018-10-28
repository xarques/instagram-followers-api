'use strict';
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const followers = require('./followers');
const { retrieveFollowers } = followers;

module.exports.collectFollowers = (event, context, callback) => {
  const name = 'adrelanine';
    retrieveFollowers(name).then(followers => {
    dynamodb.putItem({
      TableName: `${name}Followers`,
      Item: {
          "checkedDate": {
            S: new Date().toISOString()
          },
          "followers": {
            N: followers
          }
      }
    }, function(err, data) {
      if (err) {
          console.log(err, err.stack);
          callback(null, {
              statusCode: '500',
              body: err
          });
      } else {
          callback(null, {
              statusCode: '200'
          });
      }
    })
  })
};

module.exports.getFollowers = (event, context, callback) => {
  const params = {
    //TableName: process.env.DYNAMODB_TABLE
    TableName: 'adrelanineFollowers'
  }
  dynamodb.scan(params, (error, result) => {
    if (error) {
      console.error(error)
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the followers.'
      })
      return
    }
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(result.Items)
    }
    callback(null, response)
  })
}

