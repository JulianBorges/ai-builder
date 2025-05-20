
import { useState } from 'react';
import AIPromptBox from '@/components/AIPromptBox';
import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Code, Github, LayoutPanelLeft as Layout } from 'lucide-react';

const Home = () => {
  const [activeTab, setActiveTab] = useState('projects');
  
  const recentProjects = [
    {
      title: 'E-commerce Site',
      description: 'A modern e-commerce platform with product catalog and shopping cart',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
      lastUpdated: '2 days ago'
    },
    {
      title: 'Portfolio Template',
      description: 'Professional portfolio site with projects showcase and contact form',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      lastUpdated: '1 week ago'
    },
    {
      title: 'Blog Platform',
      description: 'Content-focused blog with categories and author profiles',
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
      lastUpdated: '2 weeks ago'
    }
  ];
  
  const suggestedProjects = [
    {
      title: 'SaaS Dashboard',
      description: 'Analytics dashboard for SaaS applications with charts and user management',
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
      isSuggestion: true
    },
    {
      title: 'Real Estate Listing',
      description: 'Property listing site with search filters and map integration',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
      isSuggestion: true
    },
    {
      title: 'Restaurant Website',
      description: 'Restaurant site with menu, reservations and location information',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
      isSuggestion: true
    }
  ];

  return (
    <div className="pt-20 pb-16">
      {/* Hero Section */}
      <section className="container py-20 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-3xl leading-tight">
          Build Stunning Websites <span className="text-gradient">Powered by AI</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-10">
          Transform your ideas into beautiful websites and applications with our AI-powered platform. 
          No coding required.
        </p>
        <div className="w-full max-w-2xl">
          <AIPromptBox fullWidth />
        </div>
        <div className="flex flex-wrap gap-4 justify-center mt-10">
          <Button variant="outline" className="border-primary/30 hover:border-primary">
            View Examples
          </Button>
          <Button>
            <Zap className="mr-2 h-4 w-4" />
            Start Building Free
          </Button>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="container py-20 border-t border-border/40">
        <h2 className="text-3xl font-bold text-center mb-16">
          Everything You Need to <span className="text-gradient">Build Faster</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center p-6 glass-card rounded-lg">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Generation</h3>
            <p className="text-muted-foreground">
              Describe your vision and watch as AI transforms it into a fully functional website or app.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 glass-card rounded-lg">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Layout className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visual Editor</h3>
            <p className="text-muted-foreground">
              Fine-tune your creation with our intuitive visual editor. No coding required.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 glass-card rounded-lg">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Code Access</h3>
            <p className="text-muted-foreground">
              Access and modify the underlying code if needed, with GitHub integration.
            </p>
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section className="container py-20 border-t border-border/40">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">
            <span className="text-gradient">Your Projects</span>
          </h2>
          <Tabs defaultValue="projects" value={activeTab} onValueChange={setActiveTab} className="w-fit">
            <TabsList>
              <TabsTrigger value="projects">My Projects</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <TabsContent value="projects" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProjects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="suggestions" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedProjects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </TabsContent>
      </section>
      
      {/* CTA Section */}
      <section className="container py-20 border-t border-border/40">
        <div className="glass-card p-10 lg:p-20 rounded-2xl text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to build your next project?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of creators who are building faster with AI.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg">
              <Zap className="mr-2 h-4 w-4" />
              Get Started for Free
            </Button>
            <Button variant="outline" size="lg" className="border-primary/30 hover:border-primary">
              See Examples
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
