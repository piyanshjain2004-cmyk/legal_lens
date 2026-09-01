import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import "./about.css";

const points = [
  "Built with Flask, React, Sentence Transformers, FAISS and local Hugging Face models.",
  "Uses Indian law PDFs as the knowledge base for retrieval.",
  "Shows matched source sections so answers can be checked.",
  "Designed as a simple final-year project that can be explained clearly.",
];

function About() {
  return (
    <>
      <Navbar />
      <main className="about-page">
        <section className="page-hero">
          <p className="page-label">About</p>
          <h1>An academic RAG system for Indian legal information</h1>
          <p>
            Legal Lens is built for learning, demonstration and source-backed exploration of selected Indian law documents.
          </p>
        </section>

        <section className="about-layout">
          <div className="about-box">
            <h2>Project Goal</h2>
            <p>
              The goal is to convert a legal question into document search, retrieve relevant sections and present an understandable answer with source references.
            </p>
          </div>

          <div className="about-box">
            <h2>What it includes</h2>
            <ul>
              {points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default About;
