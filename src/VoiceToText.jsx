import React, { useState, useEffect, useRef } from 'react';
import Homepage from './components/Homepage';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;

export default function VoiceToText() {
  const [transcript, setTranscript] = useState('');      // Final transcript
  const [interim, setInterim] = useState('');            // Interim transcript
  const isRecognitionActive = useRef(false);
  const inputRef = useRef(null);

  useEffect(() => {
    recognition.onstart = () => {
      console.log('Voice recognition started.');
      isRecognitionActive.current = true;
    };

    recognition.onresult = (event) => {
      let interimTranscript = ''; // Temporary holder for interim results
      let finalTranscript = '';   // Temporary holder for final results

      // Loop through the results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const speechResult = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          // If it's the final result, add it to the final transcript
          finalTranscript += speechResult;

          // Check if "OK sir!" was said
          if (speechResult.toLowerCase().includes('ok sir')) {
            inputRef.current.focus(); // Focus the input field
            finalTranscript = finalTranscript.replace(/ok sir/i, '').trim();
          }
        } else {
          // Append the interim transcript (not final yet)
          interimTranscript += speechResult;
        }
      }

      // Update the final transcript state (append final results)
      setTranscript((prev) => prev + finalTranscript);
      
      // Set the interim transcript separately, so it doesn’t overwrite final results
      setInterim(interimTranscript);
    };

    recognition.onend = () => {
      console.log('Voice recognition ended.');
      isRecognitionActive.current = false;
      // Automatically restart recognition after it ends
      if (!isRecognitionActive.current) {
        recognition.start();
        isRecognitionActive.current = true;
        console.log('Voice recognition restarted.');
      }
    };

    recognition.onerror = (event) => {
      console.error('Error occurred in speech recognition:', event.error);
      isRecognitionActive.current = false;
      if (event.error !== 'no-speech' && !isRecognitionActive.current) {
        recognition.start();
        isRecognitionActive.current = true;
        console.log('Voice recognition restarted after error.');
      }
    };

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        console.log('Microphone access granted');
        if (!isRecognitionActive.current) {
          recognition.start();
          isRecognitionActive.current = true;
          console.log('Voice recognition started on mount.');
        }
      })
      .catch((error) => {
        console.error('Microphone permission denied:', error);
      });

    return () => {
      recognition.stop();
      isRecognitionActive.current = false;
      console.log('Voice recognition stopped on unmount.');
    };
  }, []);

  return (

    
    <div>
      <h1>ChatBot</h1>
      <input
        ref={inputRef}
        type="text"
        value={transcript + interim} // Show final + interim transcripts in the input
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Your message"
      />
      <p>Listening for "OK sir!"</p>
    </div>
  );
}
