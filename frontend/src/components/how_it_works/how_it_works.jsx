import "./how_it_works.css";

const steps = [
  {
    number: "01",
    title: "Collect",
    text: "Indian law PDFs are stored inside the project knowledge base.",
  },
  {
    number: "02",
    title: "Retrieve",
    text: "FAISS searches for the sections most related to the question.",
  },
  {
    number: "03",
    title: "Explain",
    text: "The local model prepares a response using the retrieved legal context.",
  },
];

function HowItWorks() {
  return (
    <section className="how-it-works">
      <h2>Inside the Project</h2>

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
