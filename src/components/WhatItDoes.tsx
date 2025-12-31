import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Zap, Battery } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Role Fit",
    description: "Does this role align with how they naturally operate?",
    color: "brand-blue",
  },
  {
    icon: Zap,
    title: "Execution Readiness",
    description: "Can they perform at the required level right now?",
    color: "brand-yellow",
  },
  {
    icon: Battery,
    title: "Energy Sustainability",
    description: "Will this role amplify or drain them over time?",
    color: "brand-green",
  },
];

const WhatItDoes = () => {
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
          className="mx-auto max-w-4xl"
        >
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-semibold text-foreground md:text-4xl">
              What RoleColorAI actually does
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              RoleColorAI analyzes how a person is built (via RoleColorFinder) and whether 
              they can execute in a specific role, on a specific team, at a specific moment.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 * index }}
                className={`group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-6 transition-all duration-300 hover:border-${feature.color}/30 hover:bg-card`}
              >
                <div className={`mb-4 inline-flex rounded-lg bg-${feature.color}/10 p-3`}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}`} />
                </div>
                <h3 className="mb-2 text-lg font-medium text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatItDoes;
