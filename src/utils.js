'use strict'

const assert = require('assert')

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

exports.random = random
exports.boom = boom
exports.darn = darn
