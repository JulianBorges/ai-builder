
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap, ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import ProjectCard from '@/components/ProjectCard';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';

const Home = () => {
  const [prompt, setPrompt] = useState('');
  const [modelSelection, setModelSelection] = useState('gpt-4o');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from auth state
  const navigate = useNavigate();
  
  // Mock projects data
  const userProjects = [
    {
      title: 'E-commerce Site',
      description: 'A modern e-commerce platform with product catalog',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
      lastUpdated: '2 days ago'
    },
    {
      title: 'Portfolio Template',
      description: 'Professional portfolio with projects showcase',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      lastUpdated: '1 week ago'
    },
    {
      title: 'Blog Platform',
      description: 'Content-focused blog with categories',
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
      lastUpdated: '2 weeks ago'
    }
  ];

  const handleGenerateSite = () => {
    if (!prompt.trim()) return;
    
    // Store the prompt in localStorage to be used in dashboard
    localStorage.setItem('last_prompt', prompt);
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="py-4 px-6 flex justify-between items-center border-b border-border">
        <div className="flex items-center">
          <Logo />
        </div>
        
        <div>
          {isLoggedIn ? (
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          ) : (
            <Button variant="outline" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-24">
        <div className="max-w-3xl text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Create sites and apps with <span className="text-purple-500">AI</span>
          </h1>
          
          <h2 className="text-xl md:text-2xl text-muted-foreground">
            Transform your ideas into functional websites and applications 
            in seconds using our advanced AI platform.
          </h2>
          
          <div className="flex flex-col md:flex-row items-center gap-2 max-w-xl mx-auto mt-8">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  {modelSelection}
                  <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0">
                <div className="flex flex-col">
                  <Button 
                    variant="ghost" 
                    className="justify-start font-normal"
                    onClick={() => setModelSelection('gpt-4o')}
                  >
                    GPT-4o
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start font-normal"
                    onClick={() => setModelSelection('gpt-4o-mini')}
                  >
                    GPT-4o Mini
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start font-normal"
                    onClick={() => setModelSelection('claude-3')}
                  >
                    Claude-3
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            <div className="relative w-full">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the site or app you want to create..."
                className={cn(
                  "w-full px-4 py-3 rounded-md border border-border bg-background focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all",
                  "focus:shadow-[0_0_0_2px_rgba(139,92,246,0.3)]"
                )}
              />
            </div>
            
            <Button 
              onClick={handleGenerateSite} 
              className="w-full md:w-auto bg-purple-600 hover:bg-purple-700"
              disabled={!prompt.trim()}
            >
              <Zap className="mr-2 h-4 w-4" />
              Generate
            </Button>
          </div>
        </div>
      </main>

      {/* User projects section - only visible when logged in */}
      {isLoggedIn && (
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Your Projects</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProjects.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
