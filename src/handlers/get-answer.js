'use strict'

const helpers = require('../helpers')
const templates = require('../../ssml-speech')
const utils = require('../utils')
const intents = require('../intents')
const states = require('../states')
const common = require('./common')

function GetAnswer() {
  console.log('Getting answer...')
  const answer = helpers.slot(this, 'answer')
  const quiz = this.attributes.quiz
  const isCorrect = parseInt(answer) === quiz.question.answer

  // Clear the current question data.
  this.attributes.quiz.question = null
  // Increment the question index.
  this.attributes.quiz.index += 1
  if (isCorrect) {
    // Update the stats.
    this.attributes.quiz.correct += 1
  }

  const c = {
    answer: answer,
    correct: isCorrect,
    boom: utils.boom,
    darn: utils.darn,
    questionCount: this.attributes.quiz.index,
    correctCount: this.attributes.quiz.correct
  }
  const message = templates.answer(c)
  this.response.speak(message)

  if (quiz.index < quiz.total) {
    // Continue with the quiz.
    this.handler.state = states.ASK_QUESTION
    this.emitWithState(':responseReady')
  } else {
    // TODO: End the quiz.
    this.emit(':responseReady')
  }
}

exports[intents.NEW_SESSION] = common.NewSession
exports[intents.UNHANDLED] = common.Unhandled
exports[intents.GET_ANSWER] = GetAnswer
