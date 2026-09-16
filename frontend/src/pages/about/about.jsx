import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import "./about.css";

const points = [
  "Retrieves relevant legal context before generating an answer.",
  "Runs on an open-source stack with local models and FAISS search.",
  "Keeps source sections visible for review and verification.",
  "Focuses on informational guidance, not professional legal advice.",
];

function About() {
  return (
    <>
      <Navbar />
      <main className="about-page">
        <div className="about-container">
          <section className="page-hero">
            <p className="page-label">About Legal Lens</p>
            <h1>Advanced Intelligence for the Indian Legal Framework</h1>
            <p>
              Legal Lens bridges the gap between complex legal documents and accessible insights through state-of-the-art Natural Language Processing and localized Retrieval-Augmented Generation (RAG).
            </p>
            <div className="hero-badges">
              <span className="badge">100% Open Source</span>
              <span className="badge">Free & Easy to Use</span>
              <span className="badge">Privacy First</span>
            </div>
          </section>

          <section className="about-layout">
            <div className="about-section">
              <h2>Project Mission</h2>
              <div className="about-content">
                <p>
                  Our mission is to democratize legal intelligence by providing a transparent, fast, and highly accurate document-backed search experience for the Indian legal framework.
                </p>
              </div>
            </div>

            <div className="about-section">
              <h2>Core Capabilities</h2>
              <div className="about-content">
                <ul>
                  {points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="about-section">
              <h2>Data Privacy & Security</h2>
              <div className="about-content">
                <p>
                  Legal Lens runs on a privacy-first infrastructure. Document embeddings and search indices are processed locally through FAISS, ensuring no sensitive user queries are exposed to external third-party logging.
                </p>
              </div>
            </div>

            <div className="about-section">
              <h2>Important Disclaimer</h2>
              <div className="about-content">
                <p>
                  Legal Lens is intended for informational and research purposes only. It does not constitute professional legal advice. Users are strongly advised to consult certified legal practitioners before taking any legal actions.
                </p>
              </div>
            </div>
          </section>

          <section className="open-source-banner">
            <div className="banner-content">
              <h2>Completely Open Source</h2>
              <p>
                Legal Lens is built by the community, for the community. It's incredibly easy to set up and use locally. Want to contribute, report an issue, or star the project?
              </p>
            </div>
            <a href="https://github.com/piyanshjain2004-cmyk/legal_lens" target="_blank" rel="noreferrer" className="github-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              View on GitHub
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default About;
