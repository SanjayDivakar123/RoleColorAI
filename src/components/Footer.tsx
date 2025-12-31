const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-foreground">
              RoleColor<span className="gradient-text">AI</span>
            </span>
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

          <p className="text-xs text-muted-foreground">
            Powered by RoleColorFinder
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
