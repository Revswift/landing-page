import { Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative py-12 px-6 border-t border-border/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">R</span>
            </div>
            <span className="font-display font-bold text-lg">RevSwift</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </nav>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Twitter className="w-4 h-4 text-muted-foreground" />
            </a>
            <a 
              href="#" 
              className="w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Linkedin className="w-4 h-4 text-muted-foreground" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/30 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 RevSwift. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
