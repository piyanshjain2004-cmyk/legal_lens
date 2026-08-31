import "./how_it_works.css";

const steps = [
  {
    number: "01",
    title: "Ask",
    text: "Ask your legal question in normal language.",
  },
  {
    number: "02",
    title: "Search",
    text: "Legal Lens finds relevant information from the legal knowledge base.",
  },
  {
    number: "03",
    title: "Understand",
    text: "AI converts the retrieved legal information into a clear answer.",
  },
];

function HowItWorks() {
  return (
    <section className="how-it-works">
      <h2>How Legal Lens Works</h2>

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
