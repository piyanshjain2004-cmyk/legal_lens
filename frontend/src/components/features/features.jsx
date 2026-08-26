import "./features.css";

const featureData = [
  {
    title: "Ask Legal Questions",
    description:
      "Ask questions about Indian law in simple language and get clear answers.",
    icon: "⚖️",
  },
  {
    title: "Law-Based Answers",
    description:
      "Get answers generated using the legal documents available in the knowledge base.",
    icon: "📚",
  },
  {
    title: "Simple Explanations",
    description:
      "Complex legal concepts are explained in an easy-to-understand way.",
    icon: "💡",
  },
];

function Features() {
  return (
    <section className="features" id="features">
      <div className="features-container">
        <div className="features-heading">
          <span className="section-label">FEATURES</span>

          <h2>
            Legal information,
            <br />
            made <span>simple.</span>
          </h2>

          <p>
            Legal Lens helps you understand Indian law without having to
            search through hundreds of pages of legal documents.
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