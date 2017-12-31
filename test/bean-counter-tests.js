'use strict'

const AWS = require('aws-sdk')
AWS.config.update({region:'us-east-1'})

// const chai = require('chai')
// const should = chai.should()
const conversation = require('alexa-conversation')

const app = require('../index')

process.env.AWS_PROFILE = 'serverless-user'
process.env.AWS_DEFAULT_REGION = 'us-east-1'

const opts = { // those will be used to generate the requests to your skill
  name: 'Bean Counter',
  appId: 'amzn1.ask.skill.a8fc727b-1485-4aff-8baa-017713afee01',
  app: app
}

describe('bean-counter-tests', function() {
  this.timeout(10000)

  describe('#NewRequest()', function() {
    it('should work', function() {
      conversation(opts)
        .userSays('LaunchIntent').plainResponse.shouldContain('welcome')
        .end()

        // .userSays('No').plainResponse.shouldContain('lets get started')
        // .userSays('19').plainResponse.shouldContain('incorrect')
        // .userSays('19').plainResponse.shouldContain('incorrect')
        // .userSays('19').plainResponse.shouldContain('incorrect')
        // .userSays('19').plainResponse.shouldContain('incorrect')
        // .end()
    })
  })
})