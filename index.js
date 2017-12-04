'use strict'

const Alexa = require('alexa-sdk')

const templates = require('./ssml-speech')
const helpers = require('./src/helpers')
const utils = require('./src/utils')


const states = {
  start: 'start',
  question: 'question',
  answer: 'answer',
  summary: 'summary'
}


//
// Common handlers.
//

const newSession = function() {
  this.handler.state = ''
  this.emit('NewSession')
}

const unhandled = function() {
  console.log('Processing unhandled request...')
  console.log(JSON.stringify(this, null, 2))
  const message = templates.unhandled({state: this.handler.state})
  this.response.speak(message).listen(message)
  this.emit(':responseReady')
}

const commonHandlers = {
  'NewSession': newSession,
  'Unhandled': unhandled
}


//
// Default handlers..
//

const defaultNewSession = function() {
  const intentName = helpers.intentName(this)
  console.log(`Starting new session with intent: ${intentName}`)

  if (intentName) {
    // Allow the intent to pass through.
    this.emit(intentName)
  } else {
    this.handler.state = states.start
    const message = templates.welcome()
    this.response.speak(message).listen(message)
    this.emit(':responseReady')
  }
}

const defaultHandlers = createHandler({
  'NewSession': defaultNewSession
})

//
// Start handlers.
//

const startYes = function() {
  this.attributes.quiz = {
    correct: 0,     // The number of correct questions.
    incorrect: 0,   // The number of incorrect questions.
    index: 0,       // The current zero based question index.
    total: 5,       // The total number of questions for this quiz.
    level: 0        // The level of the current quiz.
  }
  this.attributes.question = generateQuestion()

  const message = templates.question(this.attributes)

  this.handler.state = states.answer
  this.response.speak(message).listen(message)
  this.emit(':responseReady')
}

const startNo = function() {
  this.emit(':tell', 'Ok, see you later.')
}

const startHandlers = createStateHandler(states.start, {
  'AMAZON.YesIntent': startYes,
  'AMAZON.NoIntent': startNo
})

//
// Question handlers.
//

const askQuestion = function() {
  this.response.speak('I should ask a question!')
  this.emit(':responseReady')
}

const questionHandlers = createStateHandler(states.question, {
  'Question': askQuestion
})


//
// Answer handlers.
//

/**
 * - New question and answer is not being generated properly
 * - I can't give one word answers.
 * - Need to add the exit handlers.
 */
const getAnswer = function() {
  console.log(JSON.stringify(this, null, 2))
  const userAnswer = parseInt(helpers.slot(this, 'answer'))
  const isCorrect = userAnswer === this.attributes.question.answer

  // Increment the question index.
  this.attributes.quiz.index += 1
  if (isCorrect) {
    // Update the stats.
    this.attributes.quiz.correct += 1
  }

  // Update the quiz score.
  this.attributes.quiz.score =
    this.attributes.quiz.correct === 0 ? 0 : Math.round(this.attributes.quiz.correct / this.attributes.quiz.index * 100)

  const c = {
    userAnswer: userAnswer,
    isCorrect: isCorrect,
    quiz: this.attributes.quiz,
    question: this.attributes.question,
    boom: utils.boom,
    darn: utils.darn,
  }

  // Generate the response to the users answer.
  const answerMessage = templates.answer(c)

  if (this.attributes.quiz.index < this.attributes.quiz.total) {
    // Create a new question.
    this.attributes.question = generateQuestion()

    // Generate the message for the next question.
    const questionMessage = templates.question(this.attributes)
    // Send the response to the answer and the next question.
    this.response.speak(`${answerMessage} ${questionMessage}`).listen(questionMessage)
    this.emit(':responseReady')
  } else {
    // End the quiz.
    this.handler.state = states.start
    // Todo: This message can be improved, keep track of historical stats?
    const questionMessage = templates.complete()
    this.response.speak(`${answerMessage} ${questionMessage}`).listen(questionMessage)
    this.emit(':responseReady')
  }
}

const answerHandlers = createStateHandler(states.answer, {
  'GetAnswerIntent': getAnswer
})


//
// Utils.
//

function extend(o = {}) {
  for (let k of Object.keys(commonHandlers)) {
    if (!o[k]) {
      o[k] = commonHandlers[k]
    }
  }
  return o
}

function createStateHandler(state, handlers) {
  return Alexa.CreateStateHandler(state, extend(handlers))
}

function createHandler(handlers) {
  return extend(handlers)
}

/**
 * Generate a question.
 */
function generateQuestion() {
  const n1 = utils.random(0, 6)
  const n2 = utils.random(0, 6)
  if (n1 === 0 && n2 === 0) {
    // Re-roll.
    return generateQuestion()
  }
  const answer = n1 + n2
  return {
    n1: n1,
    n2: n2,
    answer: answer
  }
}


/**
 * Handler function.
 */
module.exports.handler = function(event, context, callback) {
  const alexa = Alexa.handler(event, context, callback)
  alexa.appId = 'amzn1.ask.skill.a8fc727b-1485-4aff-8baa-017713afee01'
  alexa.dynamoDBTableName = 'bean_counter'

  alexa.registerHandlers(defaultHandlers, startHandlers, questionHandlers, answerHandlers)
  alexa.execute()
}
