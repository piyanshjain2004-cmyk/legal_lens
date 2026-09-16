import "./how_it_works.css";

const steps = [
  {
    number: "01",
    title: "Document Ingestion & Indexing",
    text: "Legal documents (Acts, judgments, gazettes) are parsed, chunked, and embedded into a high-dimensional vector space using local models.",
  },
  {
    number: "02",
    title: "Semantic Retrieval (FAISS)",
    text: "User queries are embedded and compared against the index. FAISS executes sub-second searches to find the most contextually relevant legal provisions.",
  },
  {
    number: "03",
    title: "LLM Drafting",
    text: "A local language model synthesizes the retrieved text, generating a coherent, plain-language answer while strictly adhering to the facts.",
  },
  {
    number: "04",
    title: "Citation & Transparency",
    text: "The final response is presented alongside exact source citations, allowing users to verify every claim against the original legal text.",
  }
];

function HowItWorks() {
  return (
    <section className="how-it-works">
      <h2>Architectural Workflow</h2>

      <div className="steps">
        {steps.map((step) => (
          <div className="step" key={step.number}>
            <span>{step.number}</span>

            <h3>{step.title}</h3>

            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
