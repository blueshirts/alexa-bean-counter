'use strict'

// const assert = require('assert')
const Alexa = require('alexa-sdk')
const messages = require('./messages')

const handleError = function (err) {
  if (err) {
    console.log('Error while processing Meow request: ' + err.toString())
    console.log(err)
  }
  else {
    console.log("Warning: No error found in handler.")
    console.trace()
  }
  this.emit(':tell', messages.error)
}

const states = {
  QUIZ: 'QUIZ'
}

// const LaunchRequest = function () {
  // const userId = this.event.session.user.userId
  // const person = this.attributes.person
  // if (person) {
  //   // I know who said meow.
  //   console.log(`${person} said meow!`)
  //   emitSomeoneSaidMeow.call(this, person)
  // } else {
  //   emitDontKnowWhoSaidMeow.call(this)
  // }
// }

// const WhoSaidMeow = function () {
//   console.log('WhoSaidMeow intent...')
//   try {
//     const intent = this.event.request.intent
//
//     let personSlot
//     if (intent && intent.slots && intent.slots.person) {
//       personSlot = intent.slots.person.value
//     }
//
//     const person = this.attributes.person
//
//     if (person) {
//       console.log('I know who said meow...')
//       emitSomeoneSaidMeow.call(this, person)
//     } else if (personSlot) {
//       console.log('You told me who said meow...')
//       this.attributes.person = personSlot
//       emitSomeoneSaidMeow.call(this, personSlot)
//     } else {
//       console.log('I\'ll ask you you said meow...')
//       return emitAskWhoSaidMeow.call(this)
//     }
//   } catch (err) {
//     handleError.call(this, err)
//   }
// }

// const SomeoneSaidMeow = function () {
//   try {
//     console.log(JSON.stringify(this.event.request, null, 2))
//     console.log('Recording who said meow...')
//     const intent = this.event.request.intent
//     const person = intent.slots.person.value
//     this.attributes.person = person
//
//     emitWhyDidYouSayMeow.call(this, person)
//   }
//   catch (err) {
//     handleError.call(this, err)
//   }
// }

// This will short-cut any incoming intent or launch requests and route them to this handler.
const NewSession = function() {
  try {
    console.log('Firing NewSession intent...')
    // this.handler.state = states.QUIZ
    this.emit(':tell', "Testing 1, 2, 3")
  } catch (err) {
    handleError.call(this, err)
  }
}

const LaunchRequest = function() {
  const message = 'Launch request is not currently implemented.'
  this.speak(message).listen(message)
  this.emit(':responseReady')
}

const Unhandled = function () {
  this.emit(':tell', messages.unhandled)
}

const defaultHandlers = {
  NewSession: NewSession,
  Unhandled: Unhandled
}

const NewQuizSession = function() {
  console.log('Creating new quiz session...')
}

const StartQuizIntent = function() {
  const message = 'Starting a new quiz.'
  console.log(message)
  this.speak(message).listen(message)
  this.emit(':responseReady')
}

const quizHandlers = Alexa.CreateStateHandler(states.QUIZ, {
  NewSession: NewQuizSession,
  StartQuizIntent: StartQuizIntent
})

// exports.LaunchRequest = LaunchRequest
exports.default = defaultHandlers
exports.quiz = quizHandlers
