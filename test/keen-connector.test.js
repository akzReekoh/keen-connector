'use strict'

const amqp = require('amqplib')

const PROJECT_ID = '560db78dd2eaaa7968e3229b'
const WRITE_KEY  = 'c9d25c945c7b15dee078343a593f41f6761be5c25ef99253c5b4628042b3cb0799cdf64d0e0ac79607a5fd4eff921c86932b3240d20db12613abbc7f363beffb4a6e35563d14eed991dd41408b33900b88c80e80849bdc1eea4ae8b4194929b587c0d3ded06d42a1ad34b928dd774600'
const COLLECTION = 'reekoh-data'

let _channel = null
let _conn = null
let app = null

describe('Keen Connector Test', () => {
  before('init', () => {
    process.env.ACCOUNT = 'adinglasan'
    process.env.CONFIG = JSON.stringify({
      projectId: PROJECT_ID,
      writeKey: WRITE_KEY,
      collection: COLLECTION
    })
    process.env.INPUT_PIPE = 'ip.keen'
    process.env.LOGGERS = 'logger1, logger2'
    process.env.EXCEPTION_LOGGERS = 'ex.logger1, ex.logger2'
    process.env.BROKER = 'amqp://guest:guest@127.0.0.1/'

    amqp.connect(process.env.BROKER)
      .then((conn) => {
        _conn = conn
        return conn.createChannel()
      }).then((channel) => {
      _channel = channel
    }).catch((err) => {
      console.log(err)
    })
  })

  after('close connection', function (done) {
    _conn.close()
    done()
  })

  describe('#start', function () {
    it('should start the app', function (done) {
      this.timeout(10000)
      app = require('../app')
      app.once('init', done)
    })
  })

  describe('#data', () => {
    it('should send data to third party client', function (done) {
      this.timeout(15000)

      let data = {
        key1: 'value1',
        key2: 121,
        key3: 40
        }

      _channel.sendToQueue('ip.keen', new Buffer(JSON.stringify(data)))
      setTimeout(done, 10000)
    })
  })
})
