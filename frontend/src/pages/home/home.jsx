import Navbar from "../../components/navbar/navbar";
import Hero from "../../components/hero/hero";
import Features from "../../components/features/features";
import HowItWorks from "../../components/how_it_works/how_it_works";
import Footer from "../../components/footer/footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </>
  );
}

export default Home;