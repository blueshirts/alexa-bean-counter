'use strict'

const templates = require('../../ssml-speech')

function NewSession() {
  this.emit('NewSession')
}

function Unhandled() {
  const message = templates.unhandled({
    state: this.handler.state
  })
  this.response.speak(message)
  this.emit(':responseReady')
}

exports.NewSession = NewSession
exports.Unhandled = Unhandled