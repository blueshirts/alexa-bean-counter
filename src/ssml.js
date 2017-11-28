// 'use strict'
// /* exported EXPORTED_LIB */
//
//
// const assert = require('assert')
//
//
// /**
//  *
//  */
// class Message {
//   constructor() {
//     this._data = []
//   }
//   data() {
//     return this._data
//   }
//   toString() {
//     return this.data.join()
//   }
//   push(s) {
//     this._data.push(s)
//   }
//
//   //
//   // Utils
//   //
//   sayAs(interpretAs, value) {
//     this.push(`<say-as interpret-as="${interpretAs}">${value}</say-as>`)
//     return this
//   }
//   prosody(attr, attrValue, value) {
//     return `<prosody ${attr}="${attrValue}">${value}</prosody>`
//   }
//   interjection(value) {
//     this.sayAs('interjection', value)
//     return this
//   }
//   number(value) {
//     this.sayAs('number', value)
//     return this
//   }
//
//
//   //
//   // Volume
//   //
//
//   volume(attrValue, value) {
//     this.prosody('volume', attrValue, value)
//     return this
//   }
//   silent(value) {
//     this.volume('silent', value)
//     return this
//   }
//   xsoft(value) {
//     this.volume('x-soft', value)
//     return this
//   }
//   soft(value) {
//     this.volume('soft', value)
//     return this
//   }
//   loud(value) {
//     this.volume('loud', value)
//     return this
//   }
//   xloud(value) {
//     this.volume('x-loud', value)
//     return this
//   }
//
//
//   //
//   // Rate
//   //
//
//   rate(attrValue, value) {
//     this.prosody('rate', attrValue, value)
//     return this
//   }
//   xslow(value) {
//     this.rate('slow', value)
//     return this
//   }
//   slow(value) {
//     this.rate('slow', value)
//     return this
//   }
//   fast(value) {
//     this.rate('fast', value)
//     return this
//   }
//   xfast(value) {
//     this.rate('x-fast', value)
//     return this
//   }
//
//
//   //
//   // Pitch
//   //
//
//   pitch(attrValue, value) {
//     this.prosody('pitch', attrValue, value)
//     return this
//   }
//
//   xlow(value) {
//     this.pitch('x-low', value)
//     return this
//   }
//
//   low(value) {
//     this.pitch('low', value)
//     return this
//   }
//
//   high(value) {
//     this.pitch('high', value)
//     return this
//   }
//
//   xhigh(value) {
//     this.pitch('x-high', value)
//     return this
//   }
//
//   yo() {
//     const i = random(0, yoInterjections.length)
//     const interjection = yoInterjections[i]
//     this.xloud(slow(high(`${interjection}!`)))
//     return this
//   }
//
//   snap() {
//     snap()
//     return this
//   }
// }
//
//
// //
// // Utilities.
// //
//
// function random(min, max) {
//   assert(min === 0 || min)
//   assert(max)
//   min = Math.ceil(min)
//   max = Math.floor(max)
//   return Math.floor(Math.random() * (max - min)) + min
// }
//
// const yoInterjections = ['yo', 'aw man', 'booya', 'd\'oh', 'dynomite', 'great scott', 'huzzah', 'kapow', 'mamma mia',
//   'spoiler alert', 'watch out']
//
// const snapInterjections = ['oh snap', 'yowzer', 'woo hoo', 'uh oh', 'mamma mia', 'good grief', 'dun dun dun']
//
// function snap() {
//   const i = random(0 ,snapInterjections.length)
//   const interjection = snapInterjections[i]
//   return loud(slow(low(`${interjection}!`)))
// }
//
// exports.Message = Message