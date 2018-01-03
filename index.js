'use strict'

const Alexa = require('alexa-sdk')
const makeImage = Alexa.utils.ImageUtils.makeImage
// const makePlainText = Alexa.utils.TextUtils.makePlainText
const textUtils = Alexa.utils.TextUtils

const templates = require('./ssml-speech')
const helpers = require('./src/helpers')
const utils = require('./src/utils')

const backgroundImage = 'https://farm5.staticflickr.com/4601/25531282158_5960c5080c_z_d.jpg'

const states = {
  start: 'start',
  question: 'question',
  answer: 'answer',
  summary: 'summary'
}

const operators = ['+', '-']

//
// Common handlers.
//

const newSession = function () {
  this.handler.state = ''
  this.emit('NewSession')
}

const unhandled = function () {
  console.log('Processing unhandled request...')
  console.log(JSON.stringify(this, null, 2))
  const message = templates.unhandled({state: this.handler.state})
  this.response.speak(message).listen(message)
  this.emit(':responseReady')
}

/**
 * Standard skill help.
 */
const help = function () {
  const message = templates.help()
  this.response.speak(message).listen(message)
  this.emit(':responseReady')
}

const cancel = function () {
  this.response.speak(templates.goodbye())
  if (supportsDisplay(this)) {
    this.response.renderTemplate(getGoodbyeTemplate(this.attributes))
  }
  this.emit(':responseReady')
}

const commonHandlers = {
  'NewSession': newSession,
  'Unhandled': unhandled,
  'AMAZON.HelpIntent': help,
  'AMAZON.CancelIntent': cancel,
  'AMAZON.StopIntent': cancel
}


//
// Default handlers..
//

const defaultNewSession = function () {
  const intentName = helpers.intentName(this)
  console.log(`Starting new session with intent: ${intentName}`)

  if (intentName) {
    // Allow the intent to pass through.
    this.emit(intentName)
  } else {
    // Welcome the user.
    this.handler.state = states.start
    const message = templates.welcome()
    this.response
      .speak(message)
    if (supportsDisplay(this)) {
      this.response.renderTemplate(getWelcomeTemplate())
    }
    this.response.listen(message)
    this.emit(':responseReady')
  }
}

const startQuiz = function () {
  this.attributes.quiz = {
    correct: 0,     // The number of correct questions.
    incorrect: 0,   // The number of incorrect questions.
    index: 0,       // The current zero based question index.
    total: 5,       // The total number of questions for this quiz.
    level: 0        // The level of the current quiz.
  }
  this.attributes.question = generateQuestion(this.attributes)

  const message = templates.question(this.attributes)

  this.handler.state = states.answer
  this.response
    .speak(message)
  if (supportsDisplay(this)) {
    this.response
      .renderTemplate(getDisplayTemplate(`Question 1`, templates.question_primary(this.attributes)))
  }
  this.response.listen(message)
  this.emit(':responseReady')
}

const defaultHandlers = createHandler({
  'NewSession': defaultNewSession,
  'StartQuizIntent': startQuiz
})

//
// Start handlers.
//

const startNo = function () {
  this.response.speak('Ok, see you later.')
  if (supportsDisplay(this)) {
    this.response.renderTemplate(getGoodbyeTemplate(this.attributes))
  }
  this.emit(':responseReady')
}

const startHandlers = createStateHandler(states.start, {
  'AMAZON.YesIntent': startQuiz,
  'AMAZON.NoIntent': startNo
})

//
// Question handlers.
//

const askQuestion = function () {
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
const getAnswer = function () {
  const userAnswer = parseInt(helpers.slot(this, 'answer'))
  if (isNaN(userAnswer)) {
    // answer is not relevant
    this.response.speak(templates.answer_invalid()).listen(templates.answer_invalid())
    this.emit(':responseReady')
    return // **EXIT**
  }
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

  const answerContext = {
    userAnswer: userAnswer,
    isCorrect: isCorrect,
    quiz: this.attributes.quiz,
    question: this.attributes.question,
    boom: utils.boom,
    darn: utils.darn,
  }

  // Generate the response to the users answer.
  let answerTemplate = ''
  if (supportsDisplay(this)) {
    answerTemplate = templates.answer_primary(answerContext)
  }
  const answerMessage = templates.answer(answerContext)

  if (this.attributes.quiz.index < this.attributes.quiz.total) {
    // Create a new question.
    this.attributes.question = generateQuestion(this.attributes)

    // Send the response to the answer and the next question.
    const questionContext = {
      quiz: this.attributes.quiz,
      question: this.attributes.question
    }
    this.response.speak(`${answerMessage} ${templates.question(questionContext)}`)

    if (supportsDisplay(this)) {
      const questionTemplate = templates.question_primary(this.attributes)
      this.response
        .renderTemplate(getDisplayTemplate(`${this.attributes.quiz.score}%`, answerTemplate + questionTemplate))
    }

    // Only ask the question on re-prompt.
    this.response.listen(templates.question(questionContext))
    this.emit(':responseReady')
  } else {
    // End the quiz.

    if (!this.attributes.stats) {
      // create the initial stats
      this.attributes.stats = {
        level: 0,
        completed: 1,
        points: this.attributes.quiz.score >= 80 ? 25 : 0
      }
    } else {
      // update the points
      if (this.attributes.quiz.score >= 80) {
        this.attributes.stats.points += 25
      } else if (this.attributes.quiz.score <= 40) {
        this.attributes.stats.points -= 25
      }

      // update the level.
      if (this.attributes.stats.points >= 300) {
        this.attributes.stats.level = 3
      } else if (this.attributes.stats.points >= 200) {
        this.attributes.stats.level = 2
      } else if (this.attributes.stats.points >= 100) {
        this.attributes.stats.level = 1
      } else if (this.attributes.stats.points < 100) {
        this.attributes.stats.level = 0
      }
    }

    this.handler.state = states.start
    const questionMessage = templates.complete(this.attributes)
    this.response.speak(`${answerMessage} ${questionMessage}`)
    if (supportsDisplay(this)) {
      this.response.renderTemplate(getCompleteTemplate(this.attributes))
    }
    this.response.listen(questionMessage)
    this.emit(':responseReady')
  }
}

const answerHandlers = createStateHandler(states.answer, {
  'GetAnswerIntent': getAnswer
})


//
// Utils.
//

function supportsDisplay(that) {
  return that.event.context &&
    that.event.context.System &&
    that.event.context.System.device &&
    that.event.context.System.device.supportedInterfaces &&
    that.event.context.System.device.supportedInterfaces.Display
}

const getWelcomeTemplate = function () {
  const builder = new Alexa.templateBuilders.BodyTemplate6Builder()
  const primaryRichText = textUtils.makeRichText(templates.welcome_primary())
  // const secondaryRichText = textUtils.makeRichText(templates.welcome_secondary())
  return builder.setTitle('Bean Counter')
    .setBackgroundImage(makeImage(backgroundImage))
    .setBackButtonBehavior('HIDDEN')
    .setTextContent(primaryRichText)
    .build()
}

function getCompleteTemplate(context) {
  const builder = new Alexa.templateBuilders.BodyTemplate1Builder()
  const primary = textUtils.makeRichText(templates.complete_primary(context))
  return builder.setTitle('Bean Counter')
    .setBackgroundImage(makeImage(backgroundImage))
    .setBackButtonBehavior('HIDDEN')
    .setTextContent(primary)
    .build()
}

const getDisplayTemplate = function (title, primary, secondary = null, tertiary = null) {
  const builder = new Alexa.templateBuilders.BodyTemplate1Builder()
  const primaryRichText = primary ? textUtils.makeRichText(primary) : undefined
  const secondaryRichText = secondary ? textUtils.makeRichText(secondary) : undefined
  const tertiaryRichText = tertiary ? textUtils.makeRichText(tertiary) : undefined
  return builder.setTitle(title)
    .setBackgroundImage(makeImage(backgroundImage))
    .setBackButtonBehavior('HIDDEN')
    .setTextContent(primaryRichText, secondaryRichText, tertiaryRichText)
    .build()
}

const getGoodbyeTemplate = function (context) {
  const builder = new Alexa.templateBuilders.BodyTemplate1Builder()
  const primary = textUtils.makeRichText(templates.goodbye_primary(context))
  return builder.setTitle('Bean Counter')
    .setBackgroundImage(makeImage(backgroundImage))
    .setBackButtonBehavior('HIDDEN')
    .setTextContent(primary)
    .build()
}

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
function generateQuestion(context) {
  let max
  let operatorIndex
  if (!context.stats || context.stats.level === 0) {
    max = 5
    operatorIndex = 0
  } else if (context.stats.level === 1) {
    max = 5
    operatorIndex = utils.random(0, 2)
  } else if (context.stats.level === 2) {
    max = 10
    operatorIndex = 0
  } else if (context.stats.level >= 3) {
    max = 10
    operatorIndex = utils.random(0, 2)
  }
  let n1 = utils.random(1, max + 1)
  let n2 = utils.random(1, max + 1)
  if (n1 < n2) {
    let t = n1
    n1 = n2
    n2 = t
  }
  const operator = operators[operatorIndex]
  if (n1 === 0 && n2 === 0) {
    // Re-roll.
    return generateQuestion(context)
  }
  let answer
  if (operator === '+') {
    answer = n1 + n2
  } else if (operator === '-') {
    answer = n1 - n2
  } else {
    throw new Error(`Invalid operator type: ${operator}`)
  }
  return {
    n1: n1,
    n2: n2,
    operator: operator,
    answer: answer
  }
}


/**
 * Handler function.
 */
module.exports.handler = function (event, context, callback) {
  const alexa = Alexa.handler(event, context, callback)
  alexa.appId = 'amzn1.ask.skill.a8fc727b-1485-4aff-8baa-017713afee01'
  alexa.dynamoDBTableName = 'bean_counter'

  alexa.registerHandlers(defaultHandlers, startHandlers, questionHandlers, answerHandlers)
  alexa.execute()
}
