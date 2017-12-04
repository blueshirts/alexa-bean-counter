'use strict'

const templates = require('../../ssml-speech')
const states = require('../states')
const helpers = require('../helpers')
const utils = require('../utils')
const intents = require('../intents')
const common = require('./common')

function AskQuestionIntent() {
  if (!this.attributes.quiz) {
    // Error
    helpers.error(this, new Error('NO quiz data found.'))
    return
  }

  const n1 = utils.random(0, 6)
  const n2 = utils.random(0, 6)
  this.attributes.quiz.question = {
    n1: n1,
    n2: n2,
    answer: n1 + n2
  }

  this.handler.state = states.GET_ANSWER
  const message = templates.question(this.attributes.quiz.question)
  this.response.speak(message).listen(message)

  // This must be emit, not emit with state or it goes into the unhandled intent.
  this.emitWithState(':responseReady')
}

exports[intents.NEW_SESSION] = common.NewSession
exports[intents.UNHANDLED] = common.Unhandled
exports[intents.ASK_QUESTION] = AskQuestionIntent
