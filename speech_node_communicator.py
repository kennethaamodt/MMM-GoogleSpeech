# coding=utf-8
# bot.py

import sys
sys.path.append("./")
sys.path.append("/usr/local/lib/python2.7/site-packages/")

import datetime
import dateutil.parser
import json
import codecs
import traceback
from speech import Speech

global user_still_interacting

class SpeechNodeCommunicator(object):
    def __init__(self):
        self.speech = Speech(credentials= self.readJsonFile(sys.argv[1]))

    def to_node(self, type, message):
        # convert to json and print (node helper will read from stdout)
        try:
            print(json.dumps({type: message}))
        except Exception:
            pass
        # stdout has to be flushed manually to prevent delays in the node helper communication
        sys.stdout.flush()

    def readJsonFile(self, file):
        #self.to_node("status", file)
        with open(file) as data_file:    
            data = json.load(data_file)
            return json.dumps(data)

    def start(self):
        self.welcome()
        self.what_to_do()

    def welcome(self):
        self.answerUser("velkommen, hva kan jeg hjelpe deg med?")

    def answerUser(self, text=None):
        if text is not None:
            self.speech.speak_text(text)

    def what_to_do(self):
        """
        Recursively decides an action based on the intent.
        :return:
        """
        self.to_node("microphone", "show")
        recognizer, audio = self.speech.listen_for_audio()
        self.to_node("microphone", "hide")

        speech = self.speech.google_speech_recognition_cloud(recognizer, audio)
        if speech is not None:
            speech = speech.lower()
            try:
                self.to_node('speech',speech);
                if 'avslutt' in speech:
                    self.answerUser("Ok, da gidder jeg ikke snakke med deg.");
                    self.answerUser("Snakes");
                elif 'speil speil' in speech:
                    self.answerUser("Du er ikke den vakreste i hvertfall, kanskje mora di!");
            except Exception as e:
                print(e)
                traceback.print_exc()
                self.answerUser("Beklager, noe gikk galt.")
                self.answerUser("Kan jeg hjelpe deg med noe mer.")

        self.what_to_do()


if __name__ == "__main__":
    speechNodeCommunicator = SpeechNodeCommunicator()
    speechNodeCommunicator.start()
