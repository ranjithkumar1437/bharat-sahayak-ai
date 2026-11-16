
import React, { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../services/api";
import {
  Bot,
  User,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  FileText,
  Languages,
  Loader2,
  AlertCircle
} from "lucide-react";

import "./AIAssistant.css";

const suggestions = [
  "Tell me about PM-KISAN",
  "What documents do students need for scholarships?",
  "How can I check scheme eligibility?",
  "How do I apply for a government scheme?"
];

const languages = [
  { value: "English", label: "English", speechCode: "en-IN" },
  { value: "Telugu", label: "తెలుగు", speechCode: "te-IN" },
  { value: "Hindi", label: "हिन्दी", speechCode: "hi-IN" },
  { value: "Tamil", label: "தமிழ்", speechCode: "ta-IN" },
  { value: "Kannada", label: "ಕನ್ನಡ", speechCode: "kn-IN" },
  { value: "Malayalam", label: "മലയാളം", speechCode: "ml-IN" },
  { value: "Marathi", label: "मराठी", speechCode: "mr-IN" },
  { value: "Bengali", label: "বাংলা", speechCode: "bn-IN" }
];

function AIAssistant() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("English");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);
  const languageRef = useRef(language);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  // Automatically scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, isLoading]);

  // Clean up voice features when leaving the page
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Stop AI voice output
  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    utteranceRef.current = null;
    setSpeakingIndex(null);
  };

  // Convert AI response into speech
  const speakAnswer = (text, index) => {
    if (!("speechSynthesis" in window)) {
      setError("Voice output is not supported in this browser.");
      return;
    }

    stopSpeaking();

    const selectedLanguage = languages.find(
      (item) => item.value === languageRef.current
    );

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = selectedLanguage?.speechCode || "en-IN";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setSpeakingIndex(index);
    };

    utterance.onend = () => {
      setSpeakingIndex(null);
      utteranceRef.current = null;
    };

    utterance.onerror = () => {
      setSpeakingIndex(null);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Send message to Gemini AI
  const handleSend = async (text = input) => {
    const question = text.trim();

    if (!question || isLoading) return;

    stopSpeaking();
    setError("");
    setInput("");

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: question
      }
    ]);

    setIsLoading(true);

    try {
      const response = await sendChatMessage(
        question,
        languageRef.current
      );

      const answer =
        response?.answer ||
        response?.message ||
        "Sorry, I could not generate a response.";

      const answerIndex = messages.length + 1;

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: answer
        }
      ]);

      speakAnswer(answer, answerIndex);

    } catch (err) {
      console.error("Gemini Assistant Error:", err);

      setError(
        err.message ||
        "Unable to connect to AI Assistant. Please try again."
      );

    } finally {
      setIsLoading(false);
    }
  };

  // Submit chat message
  const handleSubmit = (event) => {
    event.preventDefault();
    handleSend();
  };

  // Reset conversation
  const handleReset = () => {
    recognitionRef.current?.abort();
    recognitionRef.current = null;

    stopSpeaking();

    setIsListening(false);
    setMessages([]);
    setInput("");
    setError("");
  };

  // Multilingual voice input
  const handleVoiceInput = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Voice input is not supported. Please use Chrome or Microsoft Edge."
      );
      return;
    }

    setError("");

    const selectedLanguage = languages.find(
      (item) => item.value === languageRef.current
    );

    const recognition = new SpeechRecognition();

    recognition.lang =
      selectedLanguage?.speechCode || "en-IN";

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      if (event.error === "not-allowed") {
        setError(
          "Microphone permission denied. Please allow microphone access."
        );
      } else if (event.error !== "aborted") {
        setError("Voice recognition failed. Please try again.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
      recognitionRef.current = null;
      setError("Unable to start microphone. Please try again.");
    }
  };

  return (
    <div className="ai-assistant-page">

      {/* Header */}
      <div className="ai-assistant-header">
        <div>
          <p className="ai-eyebrow">
            <Sparkles size={15} />
            BHARAT SAHAYAK AI
          </p>

          <h1>AI Assistant</h1>

          <p>
            Your intelligent multilingual guide for Indian
            government schemes.
          </p>
        </div>
      </div>

      {/* Chat Card */}
      <div className="ai-chat-card">

        {/* Toolbar */}
        <div className="ai-chat-toolbar">
          <div className="ai-toolbar-title">
            <div className="ai-bot-icon">
              <Bot size={23} />
            </div>

            <div>
              <strong>Government Scheme Assistant</strong>
              <p>Powered by Gemini AI</p>
            </div>
          </div>

          <div className="ai-toolbar-actions">

            <div className="ai-language-select">
              <Languages size={17} />

              <select
                value={language}
                onChange={(event) => {
                  setLanguage(event.target.value);
                  setError("");
                }}
                disabled={isLoading || isListening}
                aria-label="Select language"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="reset-chat-button"
              onClick={handleReset}
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="ai-messages">

          {messages.length === 0 && (
            <div className="ai-welcome">
              <div className="ai-welcome-icon">
                <Sparkles size={30} />
              </div>

              <h2>Hello! Welcome to Bharat Sahayak AI</h2>

              <p>
                I can help you discover government schemes,
                understand document requirements and learn
                application procedures in your language.
              </p>

              <div className="ai-welcome-tags">
                <span>Scheme Discovery</span>
                <span>Document Guidance</span>
                <span>Multilingual AI</span>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-row ${message.role}`}
            >
              <div className="message-avatar">
                {message.role === "user" ? (
                  <User size={18} />
                ) : (
                  <Bot size={19} />
                )}
              </div>

              <div className="message-content">
                <span className="message-sender">
                  {message.role === "user"
                    ? "You"
                    : "Bharat Sahayak AI"}
                </span>

                <div className="message-bubble">
                  {message.text}
                </div>

                {message.role === "assistant" && (
                  <div className="ai-voice-controls">

                    {speakingIndex === index ? (
                      <button
                        type="button"
                        className="ai-speech-button speaking"
                        onClick={stopSpeaking}
                      >
                        <VolumeX size={15} />
                        Stop
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="ai-speech-button"
                        onClick={() =>
                          speakAnswer(message.text, index)
                        }
                      >
                        <Volume2 size={15} />
                        Listen
                      </button>
                    )}

                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="message-row assistant">
              <div className="message-avatar">
                <Bot size={19} />
              </div>

              <div className="message-content">
                <span className="message-sender">
                  Bharat Sahayak AI
                </span>

                <div className="message-bubble ai-thinking">
                  <Loader2 size={17} className="ai-loading-icon" />
                  Thinking...
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="ai-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Suggested Questions */}
        <div className="ai-suggestions">
          <p>Suggested questions</p>

          <div className="suggestion-list">
            {suggestions.map((suggestion, index) => (
              <button
                type="button"
                key={index}
                className="suggestion-button"
                disabled={isLoading}
                onClick={() => handleSend(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <form
          className="ai-input-form"
          onSubmit={handleSubmit}
        >
          <textarea
            className="ai-message-input"
            placeholder={
              isListening
                ? "Listening... Speak now"
                : "Ask about government schemes..."
            }
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey
              ) {
                event.preventDefault();
                handleSubmit(event);
              }
            }}
            rows={2}
            disabled={isLoading}
          />

          {/* Microphone */}
          <button
            type="button"
            className={`ai-mic-button ${
              isListening ? "listening" : ""
            }`}
            onClick={handleVoiceInput}
            disabled={isLoading}
            title={
              isListening
                ? "Stop recording"
                : "Start voice input"
            }
            aria-label="Voice input"
          >
            {isListening ? (
              <MicOff size={20} />
            ) : (
              <Mic size={20} />
            )}
          </button>

          {/* Send */}
          <button
            type="submit"
            className="ai-send-button"
            disabled={!input.trim() || isLoading}
            title="Send message"
            aria-label="Send message"
          >
            <Send size={19} />
          </button>
        </form>

        <p className="ai-disclaimer">
          <ShieldCheck size={14} />
          Verify important scheme details with official
          government sources.
        </p>

      </div>

      {/* Feature Cards */}
      <div className="ai-feature-grid">

        <div className="ai-feature-card">
          <ShieldCheck size={25} />
          <h3>Scheme Discovery</h3>
          <p>Explore government welfare schemes.</p>
        </div>

        <div className="ai-feature-card">
          <FileText size={25} />
          <h3>Document Guidance</h3>
          <p>Understand required documents and processes.</p>
        </div>

        <div className="ai-feature-card">
          <Mic size={25} />
          <h3>Voice Assistance</h3>
          <p>Speak questions and listen to AI answers.</p>
        </div>

      </div>
    </div>
  );
}

export default AIAssistant;
