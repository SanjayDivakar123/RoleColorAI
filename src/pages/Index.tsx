import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import WhatItDoes from "@/components/WhatItDoes";
import Distinction from "@/components/Distinction";
import Surfaces from "@/components/Surfaces";
import HowItWorks from "@/components/HowItWorks";
import ForWho from "@/components/ForWho";
import Waitlist from "@/components/Waitlist";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Problem />
        <WhatItDoes />
        <Distinction />
        <Surfaces />
        <HowItWorks />
        <ForWho />
        <Waitlist />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
