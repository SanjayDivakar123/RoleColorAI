import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const Waitlist = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="waitlist" className="relative py-24 md:py-32">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px] animate-glow-pulse" />
      </div>

      <div className="container relative mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-xl text-center"
        >
          <h2 className="mb-4 text-3xl font-semibold text-foreground md:text-4xl">
            Request Early Access
          </h2>
          <p className="mb-10 text-muted-foreground">
            RoleColorAI is currently in limited early access. We're onboarding a small 
            group of users shaping how this intelligence is applied.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm"
          >
            <form
              className="launchlist-form space-y-4"
              action="https://getlaunchlist.com/s/y0oqYO"
              method="POST"
            >
              <input
                type="text"
                name="name"
                placeholder="Full name"
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />

              <input
                type="email"
                name="email"
                placeholder="Email address"
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />

              <select
                name="persona"
                required
                defaultValue=""
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors appearance-none cursor-pointer"
              >
                <option value="" disabled className="text-muted-foreground">
                  I'm joining as…
                </option>
                <option value="individual">Individual / Professional</option>
                <option value="hiring_manager">Hiring Manager</option>
                <option value="founder_operator">Founder / Operator</option>
                <option value="student">Student / Early Career</option>
              </select>

              <textarea
                name="use_case"
                placeholder="What do you want RoleColorAI to help you decide?"
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none"
              />

              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30 active:scale-100"
              >
                Request Early Access
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Waitlist;
