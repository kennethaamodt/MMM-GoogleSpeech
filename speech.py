# speech.py
# speechrecognition, pyaudio, brew install portaudio
import sys
sys.path.append("./")
sys.path.append("/usr/local/lib/python2.7/site-packages/")

import speech_recognition as sr
import os
import requests
from gtts import gTTS
from pydub import AudioSegment
from pydub.playback import play


class Speech(object):

    def __init__(self, credentials):
        self.GOOGLE_CLOUD_SPEECH_CREDENTIALS = credentials
    
    def google_speech_recognition_cloud(self, recognizer, audio):
        cloudspeech = None
        try:
            cloudspeech = recognizer.recognize_google_cloud(audio, language='nb-NO', credentials_json=self.GOOGLE_CLOUD_SPEECH_CREDENTIALS)
        except sr.UnknownValueError:
            cloudspeech = None
        except sr.RequestError as e:
            cloudspeech = None
        return cloudspeech

    def listen_for_audio(self):
        r = sr.Recognizer()
        m = sr.Microphone()
        with m as source:
            r.adjust_for_ambient_noise(source)
            audio = r.listen(source)
        return r, audio

    def speak_text(self, text):
        tts = gTTS(text=text, lang='no')
        tts.save("tmp.mp3")
        song = AudioSegment.from_mp3("tmp.mp3")
        play(song)
        os.remove("tmp.mp3")