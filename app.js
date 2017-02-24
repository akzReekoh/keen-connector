'use strict'

let reekoh = require('reekoh')
let _plugin = new reekoh.plugins.Connector()
let async = require('async')
let isArray = require('lodash.isarray')
let isPlainObject = require('lodash.isplainobject')
let keenClient = null

let sendData = (data, callback) => {
  keenClient.addEvent(_plugin.config.collection, data, (error) => {
    if (!error) {
      _plugin.log(JSON.stringify({
        title: 'Added Keen.io Data',
        collection: _plugin.config.collection,
        data: data
      }))
    }
    callback(error)
  })
}

_plugin.on('data', (data) => {
  if (isPlainObject(data)) {
    sendData(data, (error) => {
      if (error) _plugin.logException(error)
    })
  } else if (isArray(data)) {
    async.each(data, (datum, done) => {
      sendData(datum, done)
    }, (error) => {
      if (error) _plugin.logException(error)
    })
  } else {
    _plugin.logException(new Error('Invalid data received. Must be a valid Array/JSON Object. Data ' + data))
  }
})

_plugin.once('ready', () => {
  let Keen = require('keen-js')

  keenClient = new Keen({
    projectId: _plugin.config.projectId,
    writeKey: _plugin.config.writeKey,
    protocol: 'https',
    requestType: 'jsonp'
  })

  _plugin.log('Keen Connector has been initialized.')
  _plugin.emit('init')
})

module.exports = _plugin
