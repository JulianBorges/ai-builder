
import { Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="border-t border-border/40 py-8 bg-background">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <Logo />
          <p className="text-muted-foreground text-sm">
            Build websites and apps with AI, faster than ever before.
          </p>
          <div className="flex items-center space-x-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
               className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h4 className="font-medium">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Showcase
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Guides
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="container mt-8 pt-4 border-t border-border/40 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} BuildAI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
