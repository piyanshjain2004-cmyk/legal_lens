import { Link } from "react-router-dom";

import "./hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">Indian Law AI Assistant</div>

        <h1>
          Understand Indian laws through source-backed AI assistance.
        </h1>

        <p className="hero-description">
          Legal Lens turns selected Indian law PDFs into a searchable knowledge base, then explains relevant provisions in clean, practical language.
        </p>

        <div className="hero-actions">
          <Link to="/chat" className="primary-action">Start Legal Query</Link>
          <Link to="/resources">Explore References</Link>
        </div>

        <div className="hero-stats">
          <div>
            <strong>RAG</strong>
            <span>Retrieval-based answers</span>
          </div>
          <div>
            <strong>FAISS</strong>
            <span>Fast document search</span>
          </div>
          <div>
            <strong>Local</strong>
            <span>No paid APIs</span>
          </div>
        </div>
      </div>

      <div className="hero-panel">
        <div className="panel-top">
          <p className="panel-label">Case Brief</p>
          <span>Demo</span>
        </div>

        <h3>What happens inside?</h3>

        <div className="flow-item">Legal Question</div>
        <span></span>

        <div className="flow-item">Document Retrieval</div>
        <span></span>

        <div className="flow-item">Grounded Response</div>
        <span></span>

        <div className="flow-item">Source Review</div>
      </div>
    </section>
  );
}

export default Hero;
