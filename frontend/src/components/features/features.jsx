import "./features.css";

const featureData = [
  {
    title: "Question to Context",
    description:
      "Turns a natural legal question into a search query for your Indian law PDFs.",
    icon: "01",
  },
  {
    title: "Grounded Drafting",
    description:
      "Uses retrieved provisions before generating an answer, keeping the response tied to documents.",
    icon: "02",
  },
  {
    title: "Source Review",
    description:
      "Shows matched document names and sections so the answer can be checked during evaluation.",
    icon: "03",
  },
];

function Features() {
  return (
    <section className="features" id="features">
      <div className="features-container">
        <div className="features-heading">
          <span className="section-label">FEATURES</span>

          <h2>
            Designed for a clear
            <br />
            project demonstration.
          </h2>

          <p>
            The interface keeps the workflow visible: ask, retrieve, answer and verify.
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
