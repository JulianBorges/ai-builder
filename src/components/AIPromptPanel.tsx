
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { openAIService, OpenAIModel } from '@/services/openai-service';
import { runAgentPipeline } from '@/agents/orchestrator';
import { toast } from 'sonner';
import { env } from '@/config/env';
import { Settings, Zap } from 'lucide-react';
import ApiKeyModal from './ApiKeyModal';

interface AIPromptPanelProps {
  onSubmitPrompt?: (prompt: string) => void;
  onGeneratedContent?: (content: string) => void;
  isGenerating?: boolean;
}

interface AgentInfo {
  name: string;
  description: string;
  active: boolean;
}

export const AIPromptPanel = ({
  onSubmitPrompt = () => {},
  onGeneratedContent = () => {},
  isGenerating: externalGenerating = false,
}: AIPromptPanelProps) => {
  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(externalGenerating);
  const [model, setModel] = useState<OpenAIModel>(env.DEFAULT_MODEL);
  const [progressStep, setProgressStep] = useState<string>('');
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [agents, setAgents] = useState<AgentInfo[]>([
    { name: 'Estrutura', description: 'Gera a estrutura semântica HTML5', active: true },
    { name: 'Conteúdo', description: 'Adiciona textos e conteúdos', active: true },
    { name: 'Design', description: 'Aplica estilos CSS', active: true },
    { name: 'Interações', description: 'Adiciona JavaScript interativo', active: true },
    { name: 'SEO', description: 'Otimiza para motores de busca', active: true },
  ]);
  
  useEffect(() => {
    setIsGenerating(externalGenerating);
  }, [externalGenerating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    
    // Verificar se temos a API key
    const savedApiKey = openAIService.getApiKey();
    if (!savedApiKey) {
      setShowApiKeyModal(true);
      return;
    }
    
    setIsGenerating(true);
    setProgressPercentage(0);
    setProgressStep('Iniciando geração...');
    
    try {
      // Pass the prompt to the parent component if needed
      onSubmitPrompt(prompt);
      
      // Use our agent pipeline
      const html = await runAgentPipeline(
        {
          prompt,
          model,
          siteType: detectSiteType(prompt),
        },
        (current, total, step) => {
          setProgressPercentage((current / total) * 100);
          setProgressStep(step);
        }
      );
      
      onGeneratedContent(html);
      
      // Store in localStorage for later
      localStorage.setItem('last_prompt', prompt);
      localStorage.setItem('last_generation', html);
      
      toast.success('Conteúdo gerado com sucesso!');
    } catch (error) {
      console.error('Erro na geração:', error);
      toast.error('Erro ao gerar conteúdo. Verifique sua API key e tente novamente.');
    } finally {
      setIsGenerating(false);
      // Reset progress after a delay
      setTimeout(() => {
        setProgressStep('');
        setProgressPercentage(0);
      }, 2000);
    }
  };

  // Simple site type detection
  const detectSiteType = (prompt: string): string => {
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('loja') || promptLower.includes('ecommerce') || promptLower.includes('e-commerce') || promptLower.includes('shop')) {
      return 'ecommerce';
    } else if (promptLower.includes('blog') || promptLower.includes('artigo') || promptLower.includes('notícia')) {
      return 'blog';
    } else if (promptLower.includes('portfólio') || promptLower.includes('portfolio')) {
      return 'portfolio';
    } else if (promptLower.includes('landing') || promptLower.includes('vendas')) {
      return 'landing page';
    } else if (promptLower.includes('institucional') || promptLower.includes('empresa')) {
      return 'corporate';
    }
    
    return 'website';
  };

  const toggleAgent = (index: number) => {
    const newAgents = [...agents];
    newAgents[index].active = !newAgents[index].active;
    setAgents(newAgents);
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-center">
          <Label htmlFor="prompt">Descreva seu site:</Label>
          <Button 
            variant="ghost" 
            size="icon" 
            type="button"
            onClick={() => setShowApiKeyModal(true)}
            title="Configurar API Key"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <Textarea
          id="prompt"
          placeholder="Descreva o site que você quer criar em detalhes..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 min-h-[150px] resize-none"
        />
        
        <div className="flex items-center gap-2 mt-2">
          <Label htmlFor="model" className="text-sm whitespace-nowrap">Modelo:</Label>
          <Select 
            value={model} 
            onValueChange={(value) => setModel(value as OpenAIModel)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Selecione o modelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mt-2">
          <Label className="text-sm mb-2 block">Agentes ativos:</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {agents.map((agent, index) => (
              <Button
                key={index}
                type="button"
                size="sm"
                variant={agent.active ? "default" : "outline"}
                className="text-xs"
                onClick={() => toggleAgent(index)}
                title={agent.description}
              >
                {agent.name}
              </Button>
            ))}
          </div>
        </div>
        
        {isGenerating && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>{progressStep}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} />
          </div>
        )}
        
        <div className="flex justify-end">
          <Button 
            type="submit"
            disabled={isGenerating || !prompt.trim()} 
            className="mt-4"
          >
            {isGenerating ? 'Gerando...' : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Gerar
              </>
            )}
          </Button>
        </div>
      </form>
      
      <div className="mt-auto">
        <h3 className="text-sm font-medium mb-2">Console</h3>
        <div className="text-xs p-2 bg-secondary/50 rounded-md h-24 overflow-y-auto">
          <pre>v0 pode cometer erros. Por favor use com discrição.</pre>
          {progressStep && <pre>{progressStep}</pre>}
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

export default AIPromptPanel;
