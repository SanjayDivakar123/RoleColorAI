import logoWhite from "@/assets/logo-white.svg";
import rcfWhite from "@/assets/rcf-white.svg";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <img src={logoWhite} alt="RoleColorAI" className="h-6" />
            <span className="text-sm text-muted-foreground">©</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Powered by</span>
            <img src={rcfWhite} alt="RoleColorFinder" className="h-4 opacity-70" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
