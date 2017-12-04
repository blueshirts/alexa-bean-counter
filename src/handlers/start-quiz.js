'use strict'

const states = require('../states')
const intents = require('../intents')
const common = require('./common')

const questionCount = 2

function StartQuiz() {
  this.attributes.quiz = {
    correct: 0,           // The number of correct questions.
    incorrect: 0,         // The number of incorrect questions.
    index: 0,             // The current zero based question index.
    total: questionCount, // The total number of questions for this quiz.
    level: 0              // The level of the current quiz.
  }

  this.handler.state = states.ASK_QUESTION
  this.emitWithState(intents.ASK_QUESTION)
}

exports.NewSession = common.NewSession
exports.Unhandled = common.Unhandled
exports.StartQuizIntent = StartQuiz
