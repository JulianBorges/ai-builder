
import { useState, useEffect } from 'react';
import VersionSidebar from '@/components/VersionSidebar';
import ActionBar from '@/components/ActionBar';
import UserSidebar from '@/components/UserSidebar';
import AIPromptPanel from '@/components/AIPromptPanel';
import PreviewPanel from '@/components/PreviewPanel';
import { openAIService } from '@/services/openai-service';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Monitor, Smartphone } from 'lucide-react';
import ApiKeyModal from '@/components/ApiKeyModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock pages data
const pages = [
  { id: 'home', name: 'Home', path: '/home', isActive: true },
  { id: 'about', name: 'About', path: '/about', isActive: false },
  { id: 'services', name: 'Services', path: '/services', isActive: false },
  { id: 'contact', name: 'Contact', path: '/contact', isActive: false },
];

const Dashboard = () => {
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPromptPanelCollapsed, setIsPromptPanelCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [isMobile, setIsMobile] = useState(false);
  const [activePage, setActivePage] = useState(pages[0]);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // Load any previous generated code
  useEffect(() => {
    const lastGeneration = localStorage.getItem('last_generation');
    if (lastGeneration) {
      setGeneratedCode(lastGeneration);
    }
  }, []);

  const handleSubmitPrompt = async (prompt: string) => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      await openAIService.generateWebsiteIdea(prompt, 'gpt-4o-mini', (partialText) => {
        setGeneratedCode(partialText);
      });
      
      toast.success('Generation complete!');
      // Store for persistence
      localStorage.setItem('last_generation', generatedCode);
    } catch (error) {
      console.error('Error generating site:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePromptPanel = () => {
    setIsPromptPanelCollapsed(!isPromptPanelCollapsed);
  };

  const toggleDevicePreview = () => {
    setIsMobile(!isMobile);
  };

  const handleChangePage = (page) => {
    setActivePage(page);
    // Here you would load the content for that page
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Top Bar with Actions */}
      <ActionBar 
        projectName="Next.js + shadcn/ui"
        onRefresh={() => {
          toast.info('Refreshing preview...');
        }}
        onPublish={() => {
          toast.success('Project published successfully!');
        }}
        onViewCode={() => {
          setActiveTab('code');
        }}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Version Control */}
        <VersionSidebar />
        
        {/* Main Content Panel */}
        <div className="flex-1 flex flex-col">
          {/* Tab Bar */}
          <div className="flex items-center gap-1 p-1 border-b border-border">
            <Button 
              variant={activeTab === 'editor' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setActiveTab('editor')}
              className="text-xs"
            >
              Editor
            </Button>
            <Button 
              variant={activeTab === 'code' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setActiveTab('code')}
              className="text-xs"
            >
              Code
            </Button>
            <Button 
              variant={activeTab === 'versions' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setActiveTab('versions')}
              className="text-xs"
            >
              Versions
            </Button>

            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-1 border border-border rounded-md">
                <Button 
                  variant={!isMobile ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setIsMobile(false)}
                  className="rounded-r-none"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button 
                  variant={isMobile ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setIsMobile(true)}
                  className="rounded-l-none"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowApiKeyModal(true)}>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Page Selection */}
          <div className="flex items-center gap-2 p-2 overflow-x-auto border-b border-border">
            {pages.map((page) => (
              <Button
                key={page.id}
                variant={page.id === activePage.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => handleChangePage(page)}
              >
                {page.name}
              </Button>
            ))}
            <Button variant="outline" size="sm" className="ml-2">
              + Add Page
            </Button>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel - AI Prompt */}
            <div 
              className={`border-r border-border transition-all ${
                isPromptPanelCollapsed ? 'w-12' : 'w-1/3 md:w-1/4'
              }`}
            >
              {isPromptPanelCollapsed ? (
                <div className="h-full flex items-center justify-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={togglePromptPanel}
                    className="p-2"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between p-2 border-b border-border">
                    <span className="text-sm font-medium">AI Prompt</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={togglePromptPanel}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <AIPromptPanel 
                      onSubmitPrompt={handleSubmitPrompt}
                      isGenerating={isGenerating}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Right Panel - Preview */}
            <div className={`flex-1 overflow-hidden`}>
              <PreviewPanel 
                generatedCode={generatedCode} 
                isMobile={isMobile}
              />
            </div>
          </div>
        </div>
        
        {/* Right Sidebar - User Profile */}
        <UserSidebar 
          userName="User"
          userEmail="user@example.com"
        />
      </div>

      <ApiKeyModal 
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        defaultApiKey={openAIService.getApiKey() || ''}
      />
    </div>
  );
};

export default Dashboard;
