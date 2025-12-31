import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Input",
    description: "Input resumes, roles, or team context",
    color: "brand-blue",
  },
  {
    number: "02",
    title: "Analyze",
    description: "RoleColorAI analyzes structure + execution",
    color: "brand-yellow",
  },
  {
    number: "03",
    title: "Surface",
    description: "Clear insights surface — not scores",
    color: "brand-green",
  },
  {
    number: "04",
    title: "Decide",
    description: "Better decisions happen upstream",
    color: "primary",
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="relative py-24 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-semibold text-foreground md:text-4xl">
              How it works
            </h2>
            <p className="text-muted-foreground">
              No black boxes. No personality labels.
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-brand-blue via-brand-green to-primary md:left-1/2 md:block" />

            <div className="space-y-8 md:space-y-12">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.15 * index }}
                  className={`relative flex items-center gap-6 md:gap-12 ${
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 1 ? "md:text-right" : ""}`}>
                    <div className={`rounded-xl border border-${step.color}/20 bg-card/30 p-6`}>
                      <span className={`mb-2 block text-xs font-medium text-${step.color}`}>
                        {step.number}
                      </span>
                      <h3 className="mb-1 text-lg font-medium text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className={`absolute left-8 z-10 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-${step.color} bg-background md:left-1/2 md:block`} />

                  <div className="hidden flex-1 md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
