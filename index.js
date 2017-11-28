'use strict'

const Alexa = require('alexa-sdk')
const assert = require('assert')
assert(assert)

const ctx = require('./src/context')
const voice = require('./src/voice')

const states = {
  START_QUIZ: 'START_QUIZ',
  ASK_QUESTION: 'ASK_QUESTION',
  GET_ANSWER: 'GET_ANSWER',
  EVALUATE_ANSWER: 'EVALUATE_ANSWER'
}

const intents = {
  StartQuizIntent: 'StartQuizIntent'
}


//
// Default handlers.
//

const NewSession = function() {
  console.log('Default new session...')
  const intentName = ctx.intentName(this)
  console.log('Found intent: ' + intentName)

  if (intentName === intents.StartQuizIntent) {
    // Start a quiz.
    this.handler.state = states.START_QUIZ
    this.emitWithState(intentName)
  } else {
    // Play an intro messages.
    const message = ['Welcome to daddy bean counter, would you like to take a quiz?']
    this.response.speak(message).listen(message)
    this.emit(':responseReady')
  }
}

const SessionEndedRequest = function() {
  console.log('Received session ended request...')
  ctx.clearState(this)
}

const DefaultYesIntent = function() {
  // Start a quiz.
  this.handler.state = states.START_QUIZ
  this.emitWithState(intents.StartQuizIntent)
}

const DefaultNoIntent = function() {
  // Exit
  const messages = [
    voice.low(voice.slow('Ok,')),
    voice.fast(voice.high('whatever'))
  ]
  this.response.speak(messages)
  this.emit(':responseReady')
}

function DefaultQuizIntent() {
  this.emit(':tell', 'Default quiz intent...')
}

const defaultHandlers = {
  'NewSession': NewSession,
  'SessionEndedRequest': SessionEndedRequest,
  'Unhandled': Unhandled,
  'AMAZON.YesIntent': DefaultYesIntent,
  'AMAZON.NoIntent': DefaultNoIntent,
  'QuizIntent': DefaultQuizIntent
}


//
// Start Quiz
//

function StartQuizIntent() {
  this.attributes.quiz = {
    correct: 0,
    incorrect: 0,
    question: 0
  }

  this.handler.state = states.ASK_QUESTION
  this.emitWithState('AskQuestion')
}

const startQuizHandlers = Alexa.CreateStateHandler(states.START_QUIZ, {
  'NewSession': NewSessionRedirect,
  'StartQuizIntent': StartQuizIntent,
  'Unhandled': Unhandled
})


//
// Ask Question
//

function AskQuestionIntent() {
  if (!this.attributes.quiz) {
    // Error
    handleError(this, new Error('No quiz data found.'))
    return
  }

  const n1 = random(0, 10)
  const n1_context = n1 === 1 ? 'bean' : 'beans'
  const n2 = random(0, 10)
  const n2_context = n2 === 1 ? 'bean' : 'beans'
  const answer = n1 + n2

  this.attributes.quiz.n1 = n1
  this.attributes.quiz.n2 = n2
  this.attributes.quiz.answer = answer
  const message = [
    voice.slow(`If you have ${voice.number(n1)} daddy ${n1_context} and you add ${voice.number(n2)} daddy ${n2_context}`),
    ', how many daddy beans do you have total?'
  ]
  this.handler.state = states.GET_ANSWER
  this.response.speak(message).listen(message)
  this.emitWithState(':responseReady')
}

const promptQuestionHandlers = Alexa.CreateStateHandler(states.ASK_QUESTION, {
  'NewSession': NewSessionRedirect,
  'AskQuestion': AskQuestionIntent,
  'Unhandled': Unhandled
})


//
// Get Answer
//

function GetAnswerIntent() {
  console.log(JSON.stringify(this))
  const answer = ctx.slot('answer')
  this.emit(':tell', `You said the answer ${voice.number(answer)}`)
}

const getAnswerHandlers = Alexa.CreateStateHandler(states.GET_ANSWER, {
  'NewSession': NewSessionRedirect,
  'GetAnswerIntent': GetAnswerIntent,
  'Unhandled': Unhandled
})


/**
 * Handler function.
 */
module.exports.handler = function(event, context, callback) {
  const alexa = Alexa.handler(event, context, callback)
  alexa.appId = 'amzn1.ask.skill.a8fc727b-1485-4aff-8baa-017713afee01'
  alexa.dynamoDBTableName = 'bean_counter'
  alexa.registerHandlers(defaultHandlers, startQuizHandlers, promptQuestionHandlers, getAnswerHandlers)
  alexa.execute()
}


//
// Utilities.
//

function NewSessionRedirect() {
  ctx.clearState(this)
  this.emit('NewSession')
}

function Unhandled() {
  const message = [
    voice.xloud(voice.slow(voice.interjection('doh!'))),
    ', that\'s not something I understand, please try again.'
  ]
  this.response.speak(message)
  this.emit(':responseReady')
}

function handleError(context, err) {
  if (err) {
    console.log('Error while processing Meow request: ' + err.toString())
    console.log(err)
  }
  else {
    console.log("Warning: No error found in handler.")
    console.trace()
  }
  context.response
    .speak('<say-as interpret-as="interjection">Shucks!</say-as>')
    .speak('I am having trouble figuring out who said meow.  Try again right meow!')
  context.emit(':responseReady')
}


function random(min, max) {
  assert(min === 0 || min)
  assert(max)
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
