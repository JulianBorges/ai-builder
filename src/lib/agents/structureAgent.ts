
import { AgentContext, AgentFunction } from "./types";
import { openAIService } from "@/services/openai-service";
import { debugLog } from "@/utils/debugLog";

const SYSTEM_PROMPT = `You are a website structure specialist. Your task is to create the HTML structure for a website page.

IMPORTANT INSTRUCTIONS:
1. Generate ONLY the HTML structure (semantic HTML5).
2. Use proper semantic tags: header, nav, main, section, article, aside, footer.
3. Include appropriate section IDs for content injection (e.g. id="hero", id="about", etc).
4. Create a responsive, accessible structure using good practices.
5. Use heading hierarchy (h1, h2, h3), ARIA labels, and accessibility attributes.
6. Do NOT include <html>, <head> or <style> tags — return only the body content.
7. Use placeholder text where needed.
8. Return a clean, well-formatted HTML structure.

DO NOT use markdown formatting.
DO NOT wrap the response in triple backticks or code fences.
Return only raw HTML without any markdown symbols.`;

export const structureAgent: AgentFunction = async (context: AgentContext) => {
  try {
    let result = '';
    
    await openAIService.generateWebsiteIdea(
      `Create HTML structure for a ${context.siteType || 'generic'} website page. ${context.prompt}`, 
      context.model,
      (partialText) => {
        result = partialText;
      },
      SYSTEM_PROMPT
    );
   
    debugLog("🏗️ Estrutura HTML gerada", result);

    return {
      content: result
    };
  } catch (error) {
    debugLog("❌ Structure Agent Error", error);
    return {
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error in structure agent'
    };
  }
};
