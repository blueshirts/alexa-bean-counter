'use strict'

const Alexa = require('alexa-sdk')
const handlers = require('./src/handlers')

exports.handler = function(event, context, callback) {
  const alexa = Alexa.handler(event, context, callback)
  alexa.appId = 'amzn1.ask.skill.a8fc727b-1485-4aff-8baa-017713afee01'
  alexa.dynamoDBTableName = 'bean_counter'
  alexa.registerHandlers(handlers.default, handlers.quiz)
  alexa.execute();
}
