'use strict'

const Alexa = require('alexa-sdk')
const states = require('./src/states')

/**
 * Handler function.
 */
module.exports.handler = function(event, context, callback) {
  const alexa = Alexa.handler(event, context, callback)
  alexa.appId = 'amzn1.ask.skill.a8fc727b-1485-4aff-8baa-017713afee01'
  alexa.dynamoDBTableName = 'bean_counter'

  const defaultHandlers = require('./src/handlers/default')
  const startQuizHandlers = Alexa.CreateStateHandler(states.START_QUIZ, require('./src/handlers/start-quiz'))
  const askQuestionHandlers = Alexa.CreateStateHandler(states.ASK_QUESTION, require('./src/handlers/ask-question'))
  const getAnswerHandlers = Alexa.CreateStateHandler(states.GET_ANSWER, require('./src/handlers/get-answer'))

  alexa.registerHandlers(defaultHandlers, startQuizHandlers, askQuestionHandlers, getAnswerHandlers)
  alexa.execute()
}
