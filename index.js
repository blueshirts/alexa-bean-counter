'use strict'

const Alexa = require('alexa-sdk')
const assert = require('assert')
assert(assert)

const ctx = require('./src/context')

const templates = require('./ssml-speech')

const states = {
  START_QUIZ: 'START_QUIZ',
  ASK_QUESTION: 'ASK_QUESTION',
  GET_ANSWER: 'GET_ANSWER',
  EVALUATE_ANSWER: 'EVALUATE_ANSWER'
}

const intents = {
  StartQuiz: 'StartQuiz',
  AskQuestion: 'AskQuestion',
  GetAnswer: 'GetAnswer'
}

//
// Default handlers.
//

/**
 * Always fired when a new session is started, even when an intent is triggered.
 */
const NewSession = function() {
  const intentName = ctx.intentName(this)
  // console.log('Default new session...')
  // console.log('Found intent: ' + intentName)

  if (intentName === intents.StartQuiz) {
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
  ctx.clearState(this)
}

/**
 * The user would like to take a quiz.
 */
const DefaultYesIntent = function() {
  // Start a quiz.
  this.handler.state = states.START_QUIZ
  this.emitWithState(intents.StartQuiz)
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
function DefaultQuizIntent() {
  this.handler.state = states.START_QUIZ
  this.emitWithState(intents.StartQuiz)
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

function StartQuiz() {
  console.log('Starting quiz...')
  this.attributes.quiz = {
    correct: 0,
    incorrect: 0,
    index: 0
  }

  this.handler.state = states.ASK_QUESTION
  this.emitWithState(intents.AskQuestion)
}

const startQuizHandlers = Alexa.CreateStateHandler(states.START_QUIZ, {
  'NewSession': NewSessionRedirect,
  'StartQuiz': StartQuiz,
  'Unhandled': Unhandled
})


//
// Ask Question
//

function AskQuestionIntent() {
  console.log('Asking question...')
  if (!this.attributes.quiz) {
    // Error
    handleError(this, new Error('No quiz data found.'))
    return
  }

  const n1 = random(0, 6)
  const n2 = random(0, 6)
  this.attributes.quiz.question = {
    n1: n1,
    n2: n2,
    answer: n1 + n2
  }

  this.handler.state = states.GET_ANSWER
  const message = templates.question(this.attributes.quiz.question)
  this.response.speak(message).listen(message)

  // This must be emit, not emit with state or it goes into the unhandled intent.
  this.emit(':responseReady')
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
  console.log('Getting answer...')
  const answer = ctx.slot(this, 'answer')
  const quiz = this.attributes.quiz
  const isCorrect = parseInt(answer) === quiz.question.answer

  this.attributes.quiz.question = null
  this.attributes.quiz.index += 1
  if (isCorrect) {
    this.attributes.quiz.correct += 1
  }

  // message.push(`You have currently answered ${voice.number(quiz.correct)} `)
  // message.push(`out of ${voice.number(quiz.index)} questions correctly.`)

  const c = {
    answer: answer,
    correct: isCorrect,
    boom: boom,
    darn: darn,
    questionCount: this.attributes.quiz.index,
    correctCount: this.attributes.quiz.correct
  }
  const message = templates.answer(c)
  this.response.speak(message)
  this.emit(':responseReady')
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
  // const message = [
  //   voice.xloud(voice.slow(voice.interjection('doh!'))),
  //   ', that\'s not something I understand, please try again.'
  // ]
  const message = templates.unhandled({
    state: this.handler.state
  })
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
    .speak(templates.error())
  context.emit(':responseReady')
}

function random(min, max) {
  assert(min === 0 || min)
  assert(max)
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

const boomInterjections = [
  'booya', 'dynomite', 'kapow', 'spoiler alert', 'woo hoo'
]

function boom() {
  const i = random(0, boomInterjections.length)
  const b = boomInterjections[i]
  return `${b}!`
}

const darnInterjections = [
  'aw man', 'uh oh', 'good grief', 'dun dun dun'
]

function darn() {
  const i = random(0, darnInterjections.length)
  return darnInterjections[i]
}

