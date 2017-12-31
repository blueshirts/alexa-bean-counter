"use strict"

const assert = require('assert')

/**
 * Retrieve the intent object from the context.
 * @param context - the skill handlers context.
 * @returns {Object} the intent object from the context or nuil if there was no intent.
 */
function getIntent(context) {
  assert(context)
  if (context && context.event && context.event.request && context.event.request.intent) {
    return context.event.request.intent
  } else {
    return null
  }
}

/**
 * Retrieve the current intent name from the context.
 * @param context - the skill handlers context.
 * @returns {String} the current intent name or null if there was no intent.
 */
function getIntentName(context) {
  const intent = getIntent(context)
  if (intent) {
    return intent.name
  } else {
    return null
  }
}

/**
 * Retrieve the slots object from the context.
 * @param context = the skill handlers context.
 * @returns {Object} the slots object or null if none were preaent.
 */
function getSlots(context) {
  const intent = getIntent(context)
  if (intent) {
    return intent.slots
  } else {
    return null
  }
}

/**
 * Retrieve a slot value.
 * @param context - the skills context.
 * @param slot - the slot name.
 * @returns {String} - the slot value or null.
 */
function getSlot(context, slot) {
  const slots = getSlots(context)
  if (slots) {
    const value = slots[slot]
    return value ? value.value : null
  } else {
    return null
  }
}

/**
 * https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs/issues/69
 * @param context
 */
// function clearState(context) {
//   context.handler.state = '' // delete this.handler.state might cause reference errors
//   delete context.attributes.STATE
//   context.emit(':saveState', true)
// }

/**
 * Handle a skill error.
 * @param context - the skills context.
 * @param err - the error.
 */
const error = function (context, err) {
  if (err) {
    console.log('Error while processing Meow request: ' + err.toString())
  }
  else {
    console.log("Warning: NO error found in handler.")
    console.trace()
  }
  context.response
    .speak('<say-as interpret-as="interjection">Shucks!</say-as>')
    .speak('I am having trouble figuring out who said meow.  Try again right meow!')
  context.emit(':responseReady')
}

exports.intent = getIntent
exports.intentName = getIntentName
exports.slots = getSlots
exports.slot = getSlot
exports.error = error
