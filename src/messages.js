'use strict'

// const assert = require('assert')


const error = [
  '<say-as interpret-as="interjection">Shucks!</say-as>\'',
  'I ran into a problem, please try again.'
]

const unhandled = 'Un-fur-tunately that\'s not something I understand.  Try again right meow.'

// const emitSomeoneSaidMeow = function(person) {
//   assert(person)
//   const words = [
//     '<prosody pitch="high">Yo!</prosody>',
//     `<prosody pitch="high"><prosody volume="x-loud">${person} said meow!</prosody></prosody>`
//   ]
//   this.emit(':tell', words.join())
// }
//
// const emitWhyDidYouSayMeow = function(person) {
//   assert(person)
//   const words = [
//     '<say-as interpret-as="interjection">oh snap!</say-as>',
//     `<prosody pitch="high"><prosody volume="x-loud">${person} why did you say meow!</prosody></prosody>`
//   ]
//   this.emit(':tell', words.join())
// }
//
// const emitDontKnowWhoSaidMeow = function() {
//   const words = [
//     '<say-as interpret-as="interjection">Shucks!</say-as>',
//     '<prosody pitch="high"><prosody volume="x-loud">I don\'t know who said meow!</prosody></prosody>'
//   ]
//   this.emit(":tell", words.join())
// }
//
// const emitAskWhoSaidMeow = function() {
//   const words = [
//     '<say-as interpret-as="interjection">Shucks!</say-as>',
//     '<prosody pitch="high"><prosody volume="x-loud">',
//     'I don\'t know who said meow, can you tell me who said meow?',
//     '</prosody></prosody>'
//   ]
//   const message = words.join()
//   return this.emit(":elicitSlot", 'person', message, message)
// }
//
// const emitClear = function() {
//   const words = [
//     '<say-as interpret-as="interjection">all righty!</say-as>',
//     'I cleared the current person that said meow for you.'
//   ]
//   this.emit(":tell", words.join())
// }

exports.error = error
exports.unhandled = unhandled