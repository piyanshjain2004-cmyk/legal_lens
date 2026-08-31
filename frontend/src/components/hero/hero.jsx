import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./hero.css";

function Hero() {
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
      <div className="hero-content">
        <div className="hero-badge">Indian Law RAG Assistant</div>

        <h1>
          Legal Lens helps you understand Indian laws in simple language.
        </h1>

        <p className="hero-description">
          Ask a question, search your legal PDF knowledge base, and read an
          answer with matched source sections.
        </p>

        <form className="hero-search" onSubmit={handleSubmit}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about consumer rights, theft, RTI, marriage law..."
          />

          <button type="submit">Ask</button>
        </form>

        <div className="hero-actions">
          <Link to="/chat">Open Chat</Link>
          <Link to="/resources">Useful Legal Links</Link>
        </div>
      </div>

      <div className="hero-panel">
        <p className="panel-label">Project Flow</p>

        <div>Question</div>
        <span></span>

        <div>PDF Search</div>
        <span></span>

        <div>AI Answer</div>
        <span></span>

        <div>Sources</div>
      </div>
    </section>
  );
}

export default Hero;