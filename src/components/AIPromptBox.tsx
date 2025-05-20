
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Zap, MessageCircle, Settings } from 'lucide-react';
import { openAIService, OpenAIModel } from '@/services/openai-service';
import ApiKeyModal from './ApiKeyModal';

interface AIPromptBoxProps {
  className?: string;
  fullWidth?: boolean;
}

const AIPromptBox = ({ className = "", fullWidth = false }: AIPromptBoxProps) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [model, setModel] = useState<OpenAIModel>('gpt-4o-mini');
  const [generatedText, setGeneratedText] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se já temos uma API key armazenada
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      openAIService.setApiKey(savedApiKey);
    } else {
      // Usar a API Key fornecida ou abrir o modal
      const apiKey = "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";
      if (apiKey) {
        openAIService.setApiKey(apiKey);
        localStorage.setItem('openai_api_key', apiKey);
        toast.success('API Key predefinida carregada com sucesso!');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    // Verificar se temos a API key
    const savedApiKey = openAIService.getApiKey();
    if (!savedApiKey) {
      setShowApiKeyModal(true);
      return;
    }
    
    setIsGenerating(true);
    setGeneratedText('');
    
    try {
      await openAIService.generateWebsiteIdea(prompt, model, (partialText) => {
        setGeneratedText(partialText);
      });
      
      // Armazenar o prompt e a resposta no localStorage para recuperar no dashboard
      localStorage.setItem('last_prompt', prompt);
      localStorage.setItem('last_generation', generatedText);
      
      // Mostrar toast de sucesso
      toast.success('Site gerado com sucesso! Redirecionando para o dashboard...');
      
      // Redirecionar para o dashboard após um breve delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Erro ao gerar site:', error);
      toast.error('Erro ao gerar site. Por favor, tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenApiKeySettings = () => {
    setShowApiKeyModal(true);
  };

  return (
    <>
      <Card className={`glass-card overflow-hidden ${className}`}>
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <Textarea
              placeholder="Descreva o site ou aplicativo que você deseja criar..."
              className={`border-0 bg-transparent rounded-t-md resize-none text-foreground ${fullWidth ? "h-36" : "h-24"}`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="p-3 bg-secondary/50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  type="button"
                  onClick={handleOpenApiKeySettings}
                  title="Configurar API Key"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <select 
                  className="text-xs bg-transparent border border-border rounded px-2 py-1"
                  value={model}
                  onChange={(e) => setModel(e.target.value as OpenAIModel)}
                >
                  <option value="gpt-4o-mini">GPT-4o Mini</option>
                  <option value="gpt-4o">GPT-4o</option>
                </select>
              </div>
              <Button 
                type="submit"
                disabled={!prompt.trim() || isGenerating}
                className="relative overflow-hidden"
              >
                {isGenerating ? (
                  'Gerando...'
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Gerar
                  </>
                )}
                {isGenerating && (
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse-glow"></span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {generatedText && (
        <Card className="mt-4 glass-card">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">Saída em tempo real:</h3>
            <div className="bg-black/30 p-4 rounded-md max-h-60 overflow-auto whitespace-pre-wrap">
              {generatedText || "Aguardando geração..."}
            </div>
          </CardContent>
        </Card>
      )}
      
      <ApiKeyModal 
        isOpen={showApiKeyModal} 
        onClose={() => setShowApiKeyModal(false)} 
        defaultApiKey={openAIService.getApiKey() || ''}
      />
    </>
  );
};

export default AIPromptBox;
