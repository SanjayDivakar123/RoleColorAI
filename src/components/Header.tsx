import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import logoWhite from "@/assets/logo-white.svg";

const Header = () => {
  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <a href="/" className="flex items-center">
          <img src={logoWhite} alt="RoleColorAI" className="h-7" />
        </a>
        
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            How it Works
          </a>
          <a href="#for-who" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Who It's For
          </a>
          <Button variant="hero" size="sm" onClick={scrollToWaitlist}>
            Request Early Access
          </Button>
        </nav>

        <Button variant="hero" size="sm" className="md:hidden" onClick={scrollToWaitlist}>
          Get Access
        </Button>
      </div>
    </motion.header>
  );
};

export default Header;
