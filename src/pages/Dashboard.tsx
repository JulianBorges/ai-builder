import { useState, useEffect } from 'react';
import ActionBar from '@/components/ActionBar';
import AIPromptPanel from '@/components/AIPromptPanel';
import PreviewPanel from '@/components/PreviewPanel';
import { openAIService } from '@/services/openai-service';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Monitor, Smartphone, Clock, Star, Trash2, Settings, Bolt, Code, Laptop } from 'lucide-react';
import ApiKeyModal from '@/components/ApiKeyModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Dashboard = () => {
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPromptPanelCollapsed, setIsPromptPanelCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [activePage, setActivePage] = useState('Home');

  useEffect(() => {
    const lastGeneration = localStorage.getItem('last_generation');
    if (lastGeneration) setGeneratedCode(lastGeneration);
  }, []);

  const handleSubmitPrompt = async (prompt) => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      let fullCode = '';
      await openAIService.generateWebsiteIdea(prompt, 'gpt-4o-mini', (partialText) => {
        fullCode = partialText;
        setGeneratedCode(partialText);
      });
      toast.success('Geração concluída!');
      localStorage.setItem('last_generation', fullCode);
    } catch (error) {
      console.error('Erro na geração:', error);
      toast.error('Erro ao gerar conteúdo. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };
  

  const togglePromptPanel = () => setIsPromptPanelCollapsed(!isPromptPanelCollapsed);
  const toggleDevicePreview = () => setIsMobile(!isMobile);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm"><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><ChevronRight className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><Code className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><Clock className="h-4 w-4" /></Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Laptop className="h-4 w-4" /> {activePage} ▼
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {['Home', 'About', 'Services', 'Contact'].map((page) => (
                <DropdownMenuItem key={page} onClick={() => setActivePage(page)}>{page}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-1 border border-border rounded-md ml-2">
            <Button variant={!isMobile ? 'secondary' : 'ghost'} size="sm" onClick={() => setIsMobile(false)} className="rounded-r-none">
              <Monitor className="h-4 w-4" />
            </Button>
            <Button variant={isMobile ? 'secondary' : 'ghost'} size="sm" onClick={() => setIsMobile(true)} className="rounded-l-none">
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" className="gap-1"><Bolt className="h-4 w-4" /> Deploy</Button>
          <Button variant="ghost" size="sm"><Star className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><Settings className="h-4 w-4" /></Button>

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

      <div className="flex-1 flex overflow-hidden">
        <div className={`border-r border-border transition-all ${isPromptPanelCollapsed ? 'w-12' : 'w-1/3 md:w-1/4'}`}>
          {isPromptPanelCollapsed ? (
            <div className="h-full flex items-center justify-center">
              <Button variant="ghost" size="sm" onClick={togglePromptPanel} className="p-2">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-2 border-b border-border">
                <span className="text-sm font-medium">AI Prompt</span>
                <Button variant="ghost" size="sm" onClick={togglePromptPanel}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <AIPromptPanel onSubmitPrompt={handleSubmitPrompt} isGenerating={isGenerating} />
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <PreviewPanel generatedCode={generatedCode} isMobile={isMobile} />
        </div>
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
