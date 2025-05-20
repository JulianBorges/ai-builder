
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, Github, User } from 'lucide-react';
import Logo from './Logo';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 fixed w-full top-0 z-50">
      <div className="container py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </Link>
          </nav>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link to="https://github.com" target="_blank" rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-foreground">
            <Github className="h-5 w-5" />
          </Link>
          <Link to="/login">
            <Button variant="outline" size="sm" className="border-primary/30 hover:border-primary">
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
          </Link>
        </div>
        
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden py-4 px-6 space-y-4 border-t border-border/40 bg-background">
          <Link to="/" className="block py-2 text-muted-foreground hover:text-foreground">
            Home
          </Link>
          <Link to="/dashboard" className="block py-2 text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <Link to="/blog" className="block py-2 text-muted-foreground hover:text-foreground">
            Blog
          </Link>
          <Link to="/login" className="block py-2">
            <Button variant="outline" size="sm" className="w-full border-primary/30 hover:border-primary">
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
