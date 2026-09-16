import "./features.css";

const featureData = [
  {
    title: "Semantic Legal Search",
    description: "Interprets natural-language legal queries and accurately maps them to relevant statutory contexts and precedents without keyword matching limitations.",
    icon: "01",
  },
  {
    title: "Grounded Legal Drafting",
    description: "Generates precise legal responses exclusively derived from our vetted, local knowledge base to minimize AI hallucination.",
    icon: "02",
  },
  {
    title: "Source Verification",
    description: "Maintains absolute transparency by citing exact sections, acts, and page numbers for every generated claim.",
    icon: "03",
  },
  {
    title: "Privacy-First Architecture",
    description: "Built on a local FAISS index and localized embedding models, ensuring your sensitive queries never leave the secure environment.",
    icon: "04",
  },
  {
    title: "Comprehensive Indexing",
    description: "Capable of ingesting vast amounts of unstructured legal data, including gazettes, judgments, and bare acts.",
    icon: "05",
  },
  {
    title: "Intelligent Summarization",
    description: "Condenses lengthy judicial documents, complex bills, and lengthy case laws into highly readable, actionable summaries.",
    icon: "06",
  },
];

function Features() {
  return (
    <section className="features" id="features">
      <div className="features-container">
        <div className="features-heading">
          <span className="section-label">CORE CAPABILITIES</span>

          <h2>
            Advanced tools for
            <br />
            legal professionals.
          </h2>

          <p>
            A focused, intelligent workspace engineered for exploring Indian legal information. Powered by state-of-the-art Retrieval-Augmented Generation (RAG).
          </p>
        </div>

        <div className="features-grid">
          {featureData.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
