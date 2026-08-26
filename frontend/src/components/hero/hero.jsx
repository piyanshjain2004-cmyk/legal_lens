import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./hero.css";

function hero() {
  const [question, setQuestion] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!question.trim()) return;

    navigate("/chat", {
      state: {
        question: question.trim(),
      },
    });
  };

  return (
    <section className="hero">
      <div className="hero-badge">
        INDIAN LAW AI ASSISTANT
      </div>

      <h1>
        Understand Indian Law.
        <br />
        <span>Simply.</span>
      </h1>

      <p className="hero-description">
        Ask questions about Indian law and get clear,
        easy-to-understand answers powered by AI and
        your legal knowledge base.
      </p>

      <form className="hero-search" onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a legal question..."
        />

        <button type="submit">
          Ask
        </button>
      </form>

      <p className="hero-hint">
        Example: What should I do if someone claims my property?
      </p>
    </section>
  );
}

export default hero;