import { AgentContext, GenerationPlan, OrchestrationResult, ProgressCallback } from "./types";
import { debugLog } from "@/utils/debugLog";

export const orchestrator = async (
  plan: GenerationPlan,
  context: AgentContext,
  onProgress?: ProgressCallback
): Promise<OrchestrationResult> => {
  debugLog("⚙️ Orquestração iniciada com plano", plan);

  const result: OrchestrationResult = {
    html: {},
    css: "",
    javascript: "",
    files: [],
    plan,
    agentOutputs: {}
  };

  const totalSteps =
    plan.pages.length * 2 +
    (plan.components.length + plan.styles.length) +
    3;

  let currentStep = 0;

  for (const page of plan.pages) {
    onProgress?.("structure", ++currentStep, totalSteps);
    const { structureAgent } = await import('./structureAgent');
    const structure = await structureAgent({ ...context, page });
    if (structure.html && typeof structure.html === "string" && structure.html.includes("<section")) {
      result.html[page.name] = structure.html;
      debugLog("📄 Estrutura recebida do structureAgent", structure.html);
    } else {
      debugLog("❌ Estrutura vazia ou inválida recebida do structureAgent", structure);
      result.html[page.name] = "<main>Conteúdo não disponível</main>";
    }
    result.agentOutputs[`structure_${page.name}`] = structure;
    onProgress?.("structure", currentStep, totalSteps, result.html[page.name]);
  }

  for (const page of plan.pages) {
    onProgress?.("content", ++currentStep, totalSteps);
    const { contentAgent } = await import('./contentAgent');
    const content = await contentAgent({ ...context, page, structure: result.html[page.name] });

    const baseHtml = typeof result.html[page.name] === "string" ? result.html[page.name] : "";
    result.html[page.name] = baseHtml;

    if (content.html && typeof content.html === "object") {
      for (const section in content.html) {
        const sectionRegex = new RegExp(
          `<section[^>]*id=["']${section}["'][^>]*>[\\s\\S]*?<\\/section>`,
          "i"
        );

        const replacement = `<section id="${section}"><h2>${section}</h2>${content.html[section]}</section>`;
        const original = result.html[page.name];
        const updated = original.replace(sectionRegex, replacement);

        if (updated === original) {
          debugLog("⚠️ Substituição falhou para seção:", section);
        } else {
          debugLog("✅ Seção substituída com sucesso:", section);
        }

        result.html[page.name] = updated;
      }
    } else {
      debugLog("⚠️ Conteúdo HTML ausente ou inválido para", page.name);
    }

    result.agentOutputs[`content_${page.name}`] = content;
    onProgress?.("content", currentStep, totalSteps, result.html[page.name]);
    debugLog("📝 Conteúdo gerado", result.html[page.name]);
  }

  onProgress?.("design", ++currentStep, totalSteps);
  const { designAgent } = await import('./designAgent');
  const designResponse = await designAgent({ ...context, plan });
  result.css = designResponse.css || "body { font-family: sans-serif; }";
  result.agentOutputs.design = designResponse;
  debugLog("🎨 CSS gerado", result.css);

  onProgress?.("interactions", ++currentStep, totalSteps);
  const { interactionsAgent } = await import('./interactionsAgent');
  const interactions = await interactionsAgent(context);
  result.javascript = interactions.javascript || '';
  result.agentOutputs.interactions = interactions;
  debugLog("⚡ JS gerado", result.javascript);

  onProgress?.("seo", ++currentStep, totalSteps);
  const { seoAgent } = await import('./seoAgent');
  const seoResult = await seoAgent({ ...context, plan });
  result.agentOutputs.seo = seoResult;
  debugLog("🔍 SEO gerado", seoResult);

  const { finalizationAgent } = await import('./finalizationAgent');
  const finalResult = await finalizationAgent({
    plan,
    css: result.css,
    javascript: result.javascript,
    html: result.html,
    agentOutputs: result.agentOutputs,
  });

  debugLog("✅ Resultado final do orchestrator", finalResult.html_code);

  return {
    ...result,
    html: { home: finalResult.html_code },
    files: finalResult.files,
  };
};