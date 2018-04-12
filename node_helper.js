'use strict';
const NodeHelper = require('node_helper');
const util = require('util')
const PythonShell = require('python-shell');
var pythonStarted = false

var request = require('request');

module.exports = NodeHelper.create({

  python_start: function () {
		const self = this;
    const pyshell = new PythonShell('modules/' + this.name + '/speech_node_communicator.py', { mode: 'json', args: [this.config['google_service_account_filepath']]});

    pyshell.on('message', function (message) {

      if(message.hasOwnProperty('debug')){
				console.log(message.debug);
			}
      if (message.hasOwnProperty('microphone')){
				self.sendSocketNotification('microphone', message.microphone);
			}
			if(message.hasOwnProperty('speech')){
				self.sendSocketNotification('speech', message.speech);
			}

    });

    pyshell.end(function (err) {
      if (err) throw err;
      console.log("[" + self.name + "] " + 'finished running...');
    });
  },
  
  socketNotificationReceived: function(notification, payload) {
		if(notification === 'INITIALIZE') {
      this.config = payload
      if(!pythonStarted) {
        pythonStarted = true;
        this.python_start();
        };
    };
  }
 });