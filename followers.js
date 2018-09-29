'use strict';
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const fetch = require('node-fetch');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const retrieveFollowers = (name) => {
  return  fetch(`https://instagram.com/${name}`)
  .then(res => res.text())
  .then(body => {
    const dom = new JSDOM(body);
    const document = dom.window.document;
    const description = document.querySelector('meta[property~="og:description"]').getAttribute("content");
    const followers = parseInt(description.split(' ')[0].replace(/,/g, ''));
    return followers;
  });
}

module.exports.collectFollowers = (event, context, callback) => {
  const name = 'adrelanine';
  retrieveFollowers(name).then(followers => {
    dynamodb.putItem({
      TableName: "followers",
      Item: {
          "name": {
            S: name
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
              statusCode: '200',
              body: 'Hello ' + event.queryStringParameters["name"] + '!'
          });
      }
    })
  })
};

module.exports.hello = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

