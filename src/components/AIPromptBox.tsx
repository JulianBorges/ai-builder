
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Zap, MessageCircle } from 'lucide-react';
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
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se já temos uma API key armazenada
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      openAIService.setApiKey(savedApiKey);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    // Verificar se temos a API key
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (!savedApiKey) {
      setShowApiKeyModal(true);
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const websiteIdea = await openAIService.generateWebsiteIdea(prompt, model);
      
      // Armazenar o prompt e a resposta no localStorage para recuperar no dashboard
      localStorage.setItem('last_prompt', prompt);
      localStorage.setItem('last_generation', websiteIdea);
      
      // Limpar o prompt
      setPrompt('');
      
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
                <p className="text-xs text-muted-foreground mr-4">
                  Seja detalhado para melhores resultados
                </p>
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
      
      <ApiKeyModal 
        isOpen={showApiKeyModal} 
        onClose={() => setShowApiKeyModal(false)} 
      />
    </>
  );
};

export default AIPromptBox;
