// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import AdoptionSection from "../components/AdoptionSection";
import InfoSection from "../components/InfoSection";
import CallToAction from "../components/CallToAction";
import g1 from "../assets/g1.jpg";
import g2 from "../assets/g2.jpg";
import g3 from "../assets/g3.jpg";
import p1 from "../assets/p1.jpg";
import p2 from "../assets/p2.jpg";
import p3 from "../assets/p3.jpg";

export default function Home() {
  const cats = [
    { name: "Bella", img: g1 },
    { name: "Luna", img: g2 },
    { name: "Milo", img: g3 },
  ];

  const dogs = [
    { name: "Rocky", img: p1 },
    { name: "Max", img: p2 },
    { name: "Nina", img: p3 },
  ];

  return (
    <div className="bg-[#FFFCF4]">
      <Hero />

      {/* Sección de gatos */}
      <div className="mb-20">
        <AdoptionSection title="Gatos en adopción" pets={cats} />
      </div>

      {/* Sección de perros */}
      <div className="mb-20">
        <AdoptionSection title="Perros en adopción" pets={dogs} />
      </div>

      {/* Sección informativa */}
      <div className="mb-20">
        <InfoSection />
      </div>

      {/* Call to action */}
      <div className="mb-16">
        <CallToAction />
      </div>
    </div>
  );
}
