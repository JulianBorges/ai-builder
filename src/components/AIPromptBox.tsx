
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Zap, MessageCircle, Settings } from 'lucide-react';
import { openAIService, OpenAIModel } from '@/services/openai-service';
import ApiKeyModal from './ApiKeyModal';
import HtmlPreview from './HtmlPreview';
import { plannerAgent, orchestrator } from '@/lib/agents'
import { Progress } from '@/components/ui/progress';
import { env, validateEnv } from '@/config/env';
import { debugLog } from "@/utils/debugLog";

interface AIPromptBoxProps {
  className?: string;
  fullWidth?: boolean;
}

const AIPromptBox = ({ className = "", fullWidth = false }: AIPromptBoxProps) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [model, setModel] = useState<OpenAIModel>(env.DEFAULT_MODEL);
  const [generatedText, setGeneratedText] = useState<string>('');
  const [progressStep, setProgressStep] = useState<string>('');
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se já temos uma API key armazenada
    const isEnvValid = validateEnv();
    if (!isEnvValid) {
      const savedApiKey = localStorage.getItem('openai_api_key');
      if (savedApiKey) {
        openAIService.setApiKey(savedApiKey);
      } else {
        setShowApiKeyModal(true);
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
    setProgressPercentage(0);
    setProgressStep('Iniciando...');
    
    try {
      // Use the new agent pipeline instead of direct OpenAI call
      const html = await runAgentPipeline(
        {
          prompt,
          model,
          siteType: 'professional', // This could be detected from the prompt or set by user
        },
        (current, total, step) => {
          setProgressPercentage((current / total) * 100);
          setProgressStep(step);
        }
      );
      
      setGeneratedText(html);
      
      // Armazenar o prompt e a resposta no localStorage para recuperar no dashboard
      localStorage.setItem('last_prompt', prompt);
      localStorage.setItem('last_generation', html);
      
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
      setProgressPercentage(100);
      setTimeout(() => {
        setProgressStep('');
        setProgressPercentage(0);
      }, 2000);
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
            {isGenerating && (
              <div className="px-3 py-2 bg-secondary/20">
                <div className="flex justify-between text-xs mb-1">
                  <span>{progressStep}</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} />
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {generatedText && (
        <Card className="mt-4 glass-card">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">Preview do site:</h3>
            <div className="bg-white rounded-md h-96 overflow-auto">
              <HtmlPreview htmlContent={generatedText} />
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
