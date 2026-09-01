import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import "./resources.css";

const links = [
  {
    title: "India Code",
    text: "Official source for Central Acts, State Acts, rules and legal documents.",
    url: "https://www.indiacode.nic.in/",
  },
  {
    title: "eGazette of India",
    text: "Official gazette notifications, rules and legal publications from the Government of India.",
    url: "https://egazette.gov.in/",
  },
  {
    title: "Supreme Court of India",
    text: "Official website for Supreme Court judgments, cause lists and court information.",
    url: "https://www.sci.gov.in/",
  },
  {
    title: "eCourts Services",
    text: "Case status, court orders and district court information.",
    url: "https://services.ecourts.gov.in/",
  },
  {
    title: "National Legal Services Authority",
    text: "Information about legal aid and legal services in India.",
    url: "https://nalsa.gov.in/",
  },
  {
    title: "PRS Legislative Research",
    text: "Simple summaries and analysis of Bills, Acts and policy topics.",
    url: "https://prsindia.org/",
  },
];

function Resources() {
  return (
    <>
      <Navbar />
      <main className="resources-page">
        <section className="page-hero">
          <p className="page-label">Reference Desk</p>
          <h1>Authoritative sources for legal research</h1>
          <p>
            Official portals and research references that support the project knowledge base.
          </p>
        </section>

        <section className="resource-grid">
          {links.map((link) => (
            <a href={link.url} target="_blank" rel="noreferrer" className="resource-card" key={link.title}>
              <span>{link.title}</span>
              <p>{link.text}</p>
              <strong>Visit source</strong>
            </a>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Resources;
