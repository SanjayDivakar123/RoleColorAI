import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen overflow-hidden pt-16">
      {/* Ambient glow - multi-color */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-brand-blue/10 blur-[120px] animate-glow-pulse" />
        <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-brand-green/10 blur-[100px] animate-glow-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-primary/8 blur-[80px] animate-glow-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container relative mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-4xl"
        >
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Know how people are built.{" "}
            <span className="gradient-text">Know if they can execute.</span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            RoleColorAI sits above resumes, job descriptions, and ATS systems to reveal 
            role fit, execution readiness, and team impact — before costly mistakes happen.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button variant="hero" size="xl" onClick={scrollToWaitlist}>
              Request Early Access
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="subtle" size="lg" onClick={scrollToHowItWorks}>
              How it Works
            </Button>
          </div>

          <a 
            href="https://rolecolorfinder.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-brand-blue"
          >
            Visit RoleColorFinder
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground">Scroll</span>
            <div className="h-8 w-[1px] bg-gradient-to-b from-muted-foreground to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
