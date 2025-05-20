import { useState, useEffect } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Copy, 
  ArrowLeft, 
  ArrowRight,
  Save,
  Github,
  Settings
} from 'lucide-react';
import ApiKeyModal from '@/components/ApiKeyModal';
import { openAIService } from '@/services/openai-service';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import HtmlPreview from '@/components/HtmlPreview';

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGeneration, setAiGeneration] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // Carregar prompt e geração anterior
  useEffect(() => {
    const lastPrompt = localStorage.getItem('last_prompt');
    const lastGeneration = localStorage.getItem('last_generation');
    
    if (lastPrompt) setAiPrompt(lastPrompt);
    if (lastGeneration) setAiGeneration(lastGeneration);
  }, []);

  const handleAISubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    setAiGeneration('');
    
    try {
      await openAIService.generateWebsiteIdea(aiPrompt, 'gpt-4o-mini', (partialText) => {
        setAiGeneration(partialText);
      });
      
      // Atualizar o localStorage
      localStorage.setItem('last_prompt', aiPrompt);
      localStorage.setItem('last_generation', aiGeneration);
    } catch (error) {
      console.error("Erro na geração:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVersionRollback = (version: string) => {
    // Handle version rollback
    console.log(`Rolling back to version: ${version}`);
  };
  
  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(aiGeneration)
      .then(() => {
        console.log('Copiado para a área de transferência');
      })
      .catch(err => {
        console.error('Erro ao copiar: ', err);
      });
  };

  const historyVersions = [
    { id: '1', date: 'May 20, 2025 - 10:30 AM', changes: 'Initial layout created' },
    { id: '2', date: 'May 20, 2025 - 11:45 AM', changes: 'Added header and navigation' },
    { id: '3', date: 'May 20, 2025 - 2:15 PM', changes: 'Implemented responsive design' },
    { id: '4', date: 'May 20, 2025 - 4:00 PM', changes: 'Added product listing component' },
  ];

  return (
    <div className="min-h-screen pt-16 flex">
      <DashboardSidebar 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />
      
      <main className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
        {activeTab === 'editor' && (
          <div className="flex flex-col md:flex-row h-full">
            {/* Prompt Editor */}
            <div className="w-full md:w-1/2 border-r border-border p-4 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">AI Editor</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setShowApiKeyModal(true)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Configurar API Key
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <Tabs defaultValue="prompt" className="flex-1 flex flex-col">
                <TabsList className="mb-4">
                  <TabsTrigger value="prompt">AI Prompt</TabsTrigger>
                  <TabsTrigger value="components">Components</TabsTrigger>
                </TabsList>
                
                <TabsContent value="prompt" className="flex-1 flex flex-col space-y-4 mt-0">
                  <form onSubmit={handleAISubmit} className="flex-1 flex flex-col">
                    <Textarea
                      placeholder="Descreva as mudanças que você deseja fazer..."
                      className="flex-1 resize-none border-border"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                    />
                    <div className="mt-4 flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">
                        Seja específico sobre o que você deseja mudar
                      </p>
                      <Button 
                        type="submit"
                        disabled={!aiPrompt.trim() || isGenerating}
                        className="relative overflow-hidden"
                      >
                        {isGenerating ? (
                          'Gerando...'
                        ) : (
                          <>
                            <Zap className="mr-2 h-4 w-4" />
                            Gerar Mudanças
                          </>
                        )}
                        {isGenerating && (
                          <span className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse"></span>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="components" className="flex-1 mt-0">
                  <div className="h-full border rounded-md border-border p-4">
                    <h3 className="font-medium mb-3">Available Components</h3>
                    <p className="text-muted-foreground text-sm">
                      Component library will appear here
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Preview */}
            <div className="w-full md:w-1/2 flex flex-col h-full">
              <div className="flex justify-between items-center p-4">
                <h2 className="text-xl font-semibold">Preview</h2>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 border-t border-border p-4 bg-white">
                <div className="w-full h-full rounded border border-border overflow-auto">
                  {aiGeneration ? (
                    <HtmlPreview htmlContent={aiGeneration} />
                  ) : (
                    <div className="p-4 flex items-center justify-center h-full">
                      <p className="text-muted-foreground">
                        Preview will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'code' && (
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Código Gerado</h2>
              <Button variant="outline" size="sm" onClick={copyCodeToClipboard}>
                <Copy className="h-4 w-4 mr-2" />
                Copiar Código
              </Button>
            </div>
            
            <div className="flex-1 code-window overflow-auto bg-black/30 p-4 rounded-md">
              <pre className="text-green-400 whitespace-pre-wrap">{aiGeneration || "// O código gerado pela IA aparecerá aqui.\n// Use o editor AI para gerar conteúdo."}</pre>
            </div>
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="p-6 h-full">
            <h2 className="text-xl font-semibold mb-6">Histórico de Versões</h2>
            
            <div className="space-y-4">
              {historyVersions.map((version) => (
                <div 
                  key={version.id}
                  className="p-4 border border-border rounded-lg flex justify-between items-center hover:bg-secondary/20 transition-colors"
                >
                  <div>
                    <h3 className="font-medium">{version.date}</h3>
                    <p className="text-sm text-muted-foreground">{version.changes}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleVersionRollback(version.id)}
                    className="border-primary/30 hover:border-primary"
                  >
                    Restore
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="p-6 h-full">
            <h2 className="text-xl font-semibold mb-6">Configurações do Projeto</h2>
            
            <div className="space-y-6 max-w-2xl">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Projeto</label>
                <input 
                  type="text" 
                  defaultValue="E-commerce Site" 
                  className="w-full p-2 bg-secondary/50 border border-border rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea 
                  defaultValue="Uma plataforma de e-commerce moderna com catálogo de produtos e carrinho de compras" 
                  className="w-full bg-secondary/50 border border-border"
                />
              </div>
              
              <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-medium mb-4">API Key da OpenAI</h3>
                <Button 
                  className="border-primary/30 hover:border-primary"
                  onClick={() => setShowApiKeyModal(true)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Configurar API Key
                </Button>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-medium mb-4">Integração com GitHub</h3>
                <Button className="border-primary/30 hover:border-primary">
                  <Github className="mr-2 h-4 w-4" />
                  Conectar ao GitHub
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <ApiKeyModal 
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        defaultApiKey={openAIService.getApiKey() || ''}
      />
    </div>
  );
};

export default Dashboard;
