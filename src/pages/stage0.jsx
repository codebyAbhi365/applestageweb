import React, { useState } from "react";

export default function VoiceAssistant() {
  const [text, setText] = useState("");
  const [lang, setLang] = useState("English Female");

  const speak = () => {
    if (!window.responsiveVoice) {
      alert("ResponsiveVoice not loaded. Please check your internet connection.");
      return;
    }

    if (!text.trim()) {
      alert("Please enter some text!");
      return;
    }

    window.responsiveVoice.speak(text, lang);
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "0 0 12px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
        🎤 Multilingual Voice Assistant
      </h1>

      <textarea
        placeholder="Type something here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: "100%",
          height: "100px",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      <div style={{ marginTop: "1rem" }}>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        >
          <option value="English Female">English</option>
          <option value="Hindi Female">Hindi</option>
          <option value="Marathi Female">Marathi</option>
        </select>
      </div>

      <button
        onClick={speak}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          fontSize: "16px",
          marginTop: "1rem",
          cursor: "pointer",
        }}
      >
        🔊 Speak
      </button>
    </div>
  );
}

