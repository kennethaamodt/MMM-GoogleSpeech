Module.register('MMM-GoogleSpeech', {
	defaults: {
        updateInterval: 10000
	},

    getTranslations: function() {
        return {
            no: "translations/no.json",
        }
    },
    getStyles: function() {
        return [
            'MMM-GoogleSpeech.css'
        ];
    },
	start: function() {
        var self = this;
        this.loaded = true;
        this.showMicrophone = false;
        this.textFromSpeech = "";

        this.sendSocketNotification('INITIALIZE', this.config);
        setInterval(function() {
            self.updateDom(1000);
        }, 60000);
	},
    socketNotificationReceived: function(notification, payload) {
        if(notification === 'microphone')
        {
            if(payload === 'show')
            {
                this.showMicrophone = true;
            }
            if(payload === 'hide')
            {
                this.textFromSpeech = "";
                this.showMicrophone = false;
            }
            this.updateDom(500);
        }
        if(notification === 'speech')
        {
            this.textFromSpeech = payload;
            //this.updateDom(0);
            this.processSpeech(payload);
        }
    },
    processSpeech:function(payload) {
        var self = this;
        if(payload !== undefined)
        {
            if(self.shouldShow(payload))
            {
                MM.getModules().enumerate(
                    function(module){
                        if(module.config !== undefined && module.config.google_speech_keywords !== undefined)
                        {
                            if(self.sentenceContainsTriggerWords(payload, module.config.google_speech_keywords))
                            {
                                module.show(1000);
                                Log.log("showing "+module.name)
                            }
                        }
                    });
            }
            else if (self.shouldHide(payload))
            {
                MM.getModules().enumerate(
                    function(module){
                        if(module.config !== undefined && module.config.google_speech_keywords !== undefined)
                        {
                            if(self.sentenceContainsTriggerWords(payload, module.config.google_speech_keywords))
                            {
                                module.hide(1000);
                                Log.log("hiding "+module.name)
                            }
                        }
                    });
            }
        }
    },
    shouldShow: function(payload){
        if(this.config !== undefined && this.config.show_trigger_words !== undefined)
        {
            return this.sentenceContainsTriggerWords(payload, this.config.show_trigger_words);
        }
        return false;
    },
    shouldHide: function(payload){
        if(this.config !== undefined && this.config.hide_trigger_words !== undefined)
        {
            return this.sentenceContainsTriggerWords(payload, this.config.hide_trigger_words);
        }
        return false;
    },  
    sentenceContainsTriggerWords: function(payload, trigger_words){
        var toRet = false;
        trigger_words.forEach(element => {
            if(payload.toLowerCase().indexOf(element.toLowerCase()) !== -1)
            {
                toRet = true;
            }
        });
        return toRet;
    },
    getDom: function() {
		var wrapper = document.createElement('div');

		if (!this.loaded) {
			wrapper.innerHTML = this.translate('loading');
			wrapper.className = 'dimmed light small';
			return wrapper;
        }
        if(this.showMicrophone == true){
            var microphone = document.createElement('div');
            microphone.className = 'microphone';
            microphone.appendChild(this.getMicrophoneIcon());
            wrapper.appendChild(microphone);
        }
        else{
            var emptyElement = document.createElement('div');
            emptyElement.className = 'empty';
        }
        if(this.textFromSpeech !== "")
        {
            var text = document.createTextNode(this.textFromSpeech);
            text.className = 'text';
            wrapper.appendChild(text);
        }
        return wrapper;
	},
    getMicrophoneIcon: function() {
        var image = document.createElement('img');
        image.className = 'microphone';
        image.src = this.file('images/microphone_white.png');
        return image;
    }
});