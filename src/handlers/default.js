'use strict'

const helpers = require('../helpers')
const states = require('../states')
const intents = require('../intents')
const templates = require('../../ssml-speech')
const common = require('./common')


/**
 * Always fired when a new session is started, even when an intent is triggered.
 */
const NewSession = function() {
  console.log(`Creating new session, state: ${this.handler.state}`)

  const intentName = helpers.intentName(this)

  if (intentName === intents.START_QUIZ) {
    // Start a quiz.
    this.handler.state = states.START_QUIZ
    this.emitWithState(intentName)
  } else {
    // Play an intro messages.
    const speech = templates.welcome()
    this.response.speak(speech).listen(speech)
    this.emit(':responseReady')
  }
}

/**
 * Fired on session end, sometimes...
 */
const SessionEndedRequest = function() {
  console.log('Received session ended request...')
}

/**
 * The user would like to take a quiz.
 */
const DefaultYesIntent = function() {
  this.handler.state = states.START_QUIZ
  this.emitWithState(intents.START_QUIZ)
}

/**
 * The user would not like to take a quiz.
 */
const DefaultNoIntent = function() {
  // Exit
  this.response.speak(templates.goodbye())
  this.emit(':responseReady')
}

/**
 * Intent handler to go directly to a quiz.
 */
function StartQuiz() {
  this.handler.state = states.START_QUIZ
  this.emitWithState(intents.START_QUIZ)
}

exports[intents.UNHANDLED] = common.Unhandled
exports[intents.NEW_SESSION] = NewSession
exports[intents.SESSION_ENDED_REQUEST] = SessionEndedRequest
exports[intents.YES] = DefaultYesIntent
exports[intents.NO] = DefaultNoIntent
exports[intents.START_QUIZ] = StartQuiz
