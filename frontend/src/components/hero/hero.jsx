import { Link } from "react-router-dom";

import "./hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">Professional Legal Intelligence</div>

        <h1>
          Research Indian Law with Context-Aware AI.
        </h1>

        <p className="hero-description">
          Legal Lens helps you search statutory material, review relevant excerpts and generate grounded legal information with a clear source trail.
        </p>

        <div className="hero-actions">
          <Link to="/chat" className="primary-action">Open Assistant</Link>
          <Link to="/resources">Browse Authorities</Link>
        </div>

        <div className="hero-stats">
          <div>
            <strong>10,000+</strong>
            <span>Documents Indexed</span>
          </div>
          <div>
            <strong>FAISS</strong>
            <span>Sub-second Search</span>
          </div>
          <div>
            <strong>Secure</strong>
            <span>Local Processing</span>
          </div>
        </div>
      </div>

      <div className="hero-panel">
        <div className="panel-top">
          <p className="panel-label">Research Workflow</p>
          <span>Source-led</span>
        </div>

        <h3>From query to grounded response</h3>

        <div className="flow-item">User Query Analysis</div>
        <span></span>

        <div className="flow-item">Retrieval (Acts & Precedents)</div>
        <span></span>

        <div className="flow-item">Plain-language Generation</div>
        <span></span>

        <div className="flow-item">Verification via Citations</div>
      </div>

      <div className="topic-bubbles">
        <span>Constitution</span>
        <span>Criminal Law</span>
        <span>Consumer Rights</span>
        <span>RTI</span>
        <span>Cyber Law</span>
        <span>Tax Law</span>
      </div>
    </section>
  );
}

export default Hero;
