import Hero from "../components/Hero";
import AdoptionSection from "../components/AdoptionSection";
import InfoSection from "../components/InfoSection";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";

export default function Home() {
  const cats = [
    { name: "Bella", img: "https://i.pinimg.com/736x/39/de/b5/39deb59ff143470cd25f296b9639f7e4.jpg" },
    { name: "Luna", img: "https://www.patasencasa.com/sites/default/files/styles/article_detail_desktop/public/inline-images/gato-meme.jpg.webp?itok=21fcCnzo" },
    { name: "Milo", img: "https://e7.pngegg.com/pngimages/582/702/png-clipart-grumpy-cat-meme-humour-mouse-cat-animals-cat-like-mammal-thumbnail.png" },
  ];

  const dogs = [
    { name: "Rocky", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnNTDiPRdfGMebY_P_6IPEyW2264DmSupI6Q&s" },
    { name: "Max", img: "https://preview.redd.it/as6631550tj61.jpg?auto=webp&s=9f8b41d109ff5bed814b3422efd1f5872a5b63d3" },
    { name: "Nina", img: "https://i.pinimg.com/1200x/5d/a7/42/5da7428cf51bb650635a0cb309c2366d.jpg" },
  ];

  return (
    <>
      <Hero />
      <AdoptionSection title="Gatos en adopción" pets={cats} />
      <AdoptionSection title="Perros en adopción" pets={dogs} />
      <InfoSection />
      <CallToAction />
    </>
  );
}
