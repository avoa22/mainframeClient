import React, { useState, useRef, useEffect } from "react";
import "./App.css"; // Import the external CSS file
import logo from './logo.svg';

function App() {
  const [messages, setMessages] = useState([]);
  const [previousQuestion, setPreviousQuestion] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null); // Reference to the bottom of the messages container

  // Scroll to the bottom of the chat whenever messages are updated
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user's message and clear the input field immediately
    setMessages((prev) => [...prev, { text: inputValue, isUser: true }]);
    setInputValue(""); // Clear the input field

    try {
      // Prepare questions: current and previous
      const questions = [previousQuestion, inputValue].filter(Boolean); // Filter out null/undefined values

      // Send the questions to the backend
      const response = await fetch("https://pregnancyserver-gaaee8hfhmdmajbb.westeurope-01.azurewebsites.net/qa", 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questions }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { text: data.answer, isUser: false }]); // Add bot's response
      } else {
        throw new Error("Failed to fetch response");
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Oops! Something went wrong. Please try again later.", isUser: false },
      ]);
    }

    // Update previous question
    setPreviousQuestion(inputValue);
  };

  return (
    <div className="app-wrapper">
      <div className="header">
        <img className="logo" src={logo} alt="ClosedOnes.ai Logo" /> {/* Updated logo styling */}
        <div className="burger-menu">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className="chat-box">
        <div className="chat-header">Pregnancy Helpline</div>
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-bubble ${msg.isUser ? "user-message" : "bot-message"}`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Dummy div to anchor the scroll */}
        </div>
        <div className="input-container">
          <input
            className="chat-input"
            type="text"
            placeholder="Ask about pregnancy..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button className="send-button" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
