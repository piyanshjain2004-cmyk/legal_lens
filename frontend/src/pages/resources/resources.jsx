import { useMemo, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import "./resources.css";

const links = [
  {
    title: "India Code",
    category: "Legislation",
    text: "The primary digital repository for all Central Acts, State Acts, rules, and legal texts. Essential for statutory references.",
    url: "https://www.indiacode.nic.in/",
  },
  {
    title: "eGazette of India",
    category: "Legislation",
    text: "Official notifications and gazette publications. Used for validating recent amendments and official legal updates.",
    url: "https://egazette.gov.in/",
  },
  {
    title: "Supreme Court of India",
    category: "Courts",
    text: "The official portal for judgments, daily orders, cause lists, and official updates from the Supreme Court.",
    url: "https://www.sci.gov.in/",
  },
  {
    title: "eCourts Services",
    category: "Courts",
    text: "Access case status, orders, and district court information for public court-service lookup across India.",
    url: "https://services.ecourts.gov.in/",
  },
  {
    title: "National Legal Services Authority",
    category: "Legal Aid",
    text: "Information on legal aid, Lok Adalats, and access points for citizens seeking free legal services.",
    url: "https://nalsa.gov.in/",
  },
  {
    title: "PRS Legislative Research",
    category: "Research",
    text: "Comprehensive legislative summaries, Bill tracking, and policy notes for an in-depth understanding of Parliament affairs.",
    url: "https://prsindia.org/",
  },
  {
    title: "Law Commission of India",
    category: "Research",
    text: "Reports and recommendations on legal reforms submitted by the Law Commission to the Government.",
    url: "https://lawcommissionofindia.nic.in/",
  },
  {
    title: "Bar Council of India",
    category: "Professional",
    text: "Rules, regulations, and directories pertaining to legal practice and education in India.",
    url: "http://www.barcouncilofindia.org/",
  }
];

function Resources() {
  const [category, setCategory] = useState("All");
  
  const categories = ["All", ...new Set(links.map((link) => link.category))];

  const visibleLinks = useMemo(() => {
    return links.filter((link) => {
      return category === "All" || link.category === category;
    });
  }, [category]);

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="resources-page">
        <header className="page-header">
          <div className="header-content">
            <span className="overline">Legal Authorities</span>
            <h1>Reference Desk</h1>
            <p>
              Authoritative portals for legal research, verification, and policy tracking. Browse official legislation, court services, and legal aid portals.
            </p>
          </div>
        </header>

        <div className="resources-container">
          <aside className="resources-sidebar">
            <h3>Filter by Category</h3>
            <ul className="category-list">
              {categories.map((item) => (
                <li key={item}>
                  <button 
                    className={category === item ? "active" : ""}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <section className="resources-list">
            <div className="list-header">
              <h2>{category === "All" ? "All Resources" : `${category} Resources`}</h2>
              <span>Showing {visibleLinks.length} results</span>
            </div>
            
            <div className="links-grid">
              {visibleLinks.map((link) => (
                <a href={link.url} target="_blank" rel="noreferrer" className="resource-item" key={link.title}>
                  <div className="resource-item-header">
                    <span className="resource-badge">{link.category}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </div>
                  <h3>{link.title}</h3>
                  <p>{link.text}</p>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Resources;
