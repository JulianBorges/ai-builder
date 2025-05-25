import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { openAIService, OpenAIModel } from '@/services/openai-service';
import { orchestrator } from '@/lib/agents/orchestrator';
import { plannerAgent } from '@/lib/agents/plannerAgent';
import { toast } from 'sonner';
import ApiKeyModal from './ApiKeyModal';
import { debugLog } from "@/utils/debugLog";

const AIPromptPanel = ({ onHtmlUpdate = () => {}, model = 'gpt-4o-mini', isGenerating: externalGenerating = false }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(externalGenerating);
  const [progressStep, setProgressStep] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    const savedApiKey = openAIService.getApiKey();
    if (!savedApiKey) {
      setShowApiKeyModal(true);
      return;
    }

    setIsGenerating(true);
    setProgressPercentage(0);
    setProgressStep("Planejando...");

    try {
      const planResponse = await plannerAgent({ prompt, model, siteType: detectSiteType(prompt) });

      if (planResponse.error) throw new Error(planResponse.error);

      const result = await orchestrator(
        planResponse.content,
        { prompt, model },
        (step, current, total, partialHtml) => {
          setProgressStep(step);
          setProgressPercentage((current / total) * 100);
          debugLog("🧩 Etapa", step);

          if (partialHtml) {
            if (
              typeof partialHtml === "object" &&
              typeof partialHtml.home === "string" &&
              partialHtml.home.includes("<html")
            ) {
              onHtmlUpdate({ home: partialHtml.home });
              debugLog("📥 HTML parcial aceito (via .home):", partialHtml.home.slice(0, 200));
            } else if (
              typeof partialHtml === "string" &&
              partialHtml.includes("<html")
            ) {
              onHtmlUpdate({ home: partialHtml });
              debugLog("📥 HTML parcial aceito (string direta):", partialHtml.slice(0, 200));
            } else {
              debugLog("❌ HTML parcial inválido e ignorado:", partialHtml);
            }
          }
        }
      );

      const html = result.html['home'] || '';
      if (typeof html === "string" && html.includes("<html")) {
        onHtmlUpdate({ home: html });
        debugLog("📥 HTML final enviado", html.slice(0, 200));
      } else {
        toast.error("HTML inválido gerado");
        debugLog("❌ HTML inválido:", html);
      }

      localStorage.setItem('last_prompt', prompt);
      localStorage.setItem('last_generation', html);
      toast.success("Conteúdo gerado com sucesso!");
    } catch (error) {
      debugLog("❌ Erro na geração", error);
      toast.error("Erro ao gerar conteúdo. Verifique sua API key e tente novamente.");
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        setProgressStep('');
        setProgressPercentage(0);
      }, 2000);
    }
  };

  const detectSiteType = (prompt) => {
    const p = prompt.toLowerCase();
    if (p.includes("loja")) return "ecommerce";
    if (p.includes("blog")) return "blog";
    if (p.includes("portfolio")) return "portfolio";
    if (p.includes("landing")) return "landing";
    return "website";
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Descreva o site que deseja..." />
        <Button type="submit" disabled={isGenerating}>
          {isGenerating ? "Gerando..." : "Gerar Site"}
        </Button>
      </form>
      {isGenerating && (
        <div className="mt-2">
          <p>{progressStep}</p>
          <Progress value={progressPercentage} />
        </div>
      )}
      <ApiKeyModal isOpen={showApiKeyModal} onClose={() => setShowApiKeyModal(false)} defaultApiKey={openAIService.getApiKey() || ''} />
    </div>
  );
};

export default AIPromptPanel;