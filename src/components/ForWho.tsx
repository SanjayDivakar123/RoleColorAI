import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, X } from "lucide-react";

const forItems = [
  "Hiring managers who hate repeat mistakes",
  "Founders building teams under pressure",
  "Professionals who want honest career clarity",
];

const notForItems = [
  "Keyword-only hiring",
  "Personality test fans",
  "Mass resume spam",
];

const ForWho = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="for-who" className="relative py-24 md:py-32">
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
              Who this is for
            </h2>
            <p className="text-muted-foreground">And who it isn't</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* This is for */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border border-brand-green/20 bg-brand-green/5 p-8"
            >
              <h3 className="mb-6 text-lg font-medium text-foreground">
                This is for:
              </h3>
              <ul className="space-y-4">
                {forItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-brand-green/20 p-1">
                      <Check className="h-3.5 w-3.5 text-brand-green" />
                    </div>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* This is not for */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl border border-border/50 bg-card/30 p-8"
            >
              <h3 className="mb-6 text-lg font-medium text-foreground">
                This is not for:
              </h3>
              <ul className="space-y-4">
                {notForItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-muted p-1">
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ForWho;
