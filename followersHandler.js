'use strict';
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const followers = require('./followers');
const { retrieveFollowers } = followers;

module.exports.collectFollowers = (event, context, callback) => {
  const accountIds = event['accountIds']
  console.log('collectFollowers event', accountIds)

  accountIds.forEach((accountId) => {
    console.log('collectFollowers accountId', accountId)
      retrieveFollowers(accountId).then(followers => {
      dynamodb.putItem({
        TableName: `${accountId}Followers`,
        Item: {
            "checkedDate": {
              S: new Date().toISOString()
            },
            "followers": {
              N: followers.toString()
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
  })
};

module.exports.getFollowers = (event, context, callback) => {
  const accountId = event['pathParameters']['id']
  console.log('getFollowers id', accountId)

  const params = {
    //TableName: process.env.DYNAMODB_TABLE
    TableName: `${accountId}Followers`
  }
  dynamodb.scan(params, (error, result) => {
    console.log('getFollowers scan', params)
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

