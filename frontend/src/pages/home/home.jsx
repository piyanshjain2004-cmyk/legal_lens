import Navbar from "../../components/navbar/navbar";
import Hero from "../../components/hero/hero";
import Features from "../../components/features/features";
import HowItWorks from "../../components/how_it_works/how_it_works";
import Footer from "../../components/footer/footer";
import "./home.css";

function Home() {
  return (
    <div className="home-wrapper">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
}

export default Home;