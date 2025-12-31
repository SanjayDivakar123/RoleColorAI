import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import rcfLogo from "@/assets/rcf-color.svg";
import rcaiLogo from "@/assets/logo-color.svg";

const rcfPoints = [
  "Decision style",
  "Leadership behavior",
  "Pressure response",
  "Team role tendencies",
];

const rcaiPoints = [
  "Skill depth",
  "Evidence of execution",
  "Job & team fit",
  "Outcome prediction",
];

const Distinction = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-5xl"
        >
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-semibold text-foreground md:text-4xl">
              RCF × RCAI
            </h2>
            <p className="text-muted-foreground">The complete intelligence system</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* RoleColorFinder */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border border-brand-blue/30 bg-card/30 p-8"
            >
              <div className="mb-6">
                <img src={rcfLogo} alt="RoleColorFinder" className="h-8 mb-3" />
                <p className="text-sm text-muted-foreground">How people are built</p>
              </div>
              <ul className="space-y-3">
                {rcfPoints.map((point, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-blue/70" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* RoleColorAI */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl border border-brand-green/30 bg-card/50 p-8"
            >
              <div className="mb-6">
                <img src={rcaiLogo} alt="RoleColorAI" className="h-8 mb-3" />
                <p className="text-sm text-muted-foreground">How well they can execute</p>
              </div>
              <ul className="space-y-3">
                {rcaiPoints.map((point, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-green/70" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 text-center text-muted-foreground"
          >
            Together, they form a complete decision intelligence system.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Distinction;
