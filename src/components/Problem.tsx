import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { XCircle } from "lucide-react";

const problems = [
  "Hiring fails even with 'great candidates'",
  "Resumes show history, not fit",
  "Teams break under pressure, not on paper",
  "Burnout looks random — but it isn't",
];

const Problem = () => {
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
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="mb-12 text-3xl font-semibold text-foreground md:text-4xl">
            The problem isn't process.{" "}
            <span className="text-muted-foreground">It's missing intelligence.</span>
          </h2>

          <div className="mb-12 grid gap-4 sm:grid-cols-2">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 p-4 text-left"
              >
                <XCircle className="h-5 w-5 shrink-0 text-destructive/70" />
                <span className="text-sm text-muted-foreground">{problem}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Problem;
