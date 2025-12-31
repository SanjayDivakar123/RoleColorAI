import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { User, Users, Building2, Briefcase } from "lucide-react";

const surfaces = [
  {
    icon: User,
    title: "For Individuals",
    description: "Avoid roles that break you.",
  },
  {
    icon: Briefcase,
    title: "For Hiring Managers",
    description: "Understand fit before the hire.",
  },
  {
    icon: Users,
    title: "For Teams",
    description: "Design balance, not chaos.",
  },
  {
    icon: Building2,
    title: "For Organizations",
    description: "Reduce mis-hires and burnout.",
  },
];

const Surfaces = () => {
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
              One brain, many surfaces
            </h2>
            <p className="text-muted-foreground">
              Different users. Same intelligence core.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {surfaces.map((surface, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="group rounded-xl border border-border/50 bg-card/30 p-6 text-center transition-all duration-300 hover:border-border hover:bg-card/50"
              >
                <div className="mx-auto mb-4 inline-flex rounded-full bg-secondary p-3">
                  <surface.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <h3 className="mb-2 text-sm font-medium text-foreground">
                  {surface.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {surface.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Surfaces;
