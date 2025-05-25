
import { AgentContext, AgentFunction } from "./types";
import { openAIService } from "@/services/openai-service";
import { debugLog } from "@/utils/debugLog";

const SYSTEM_PROMPT = `You are a website structure specialist. 
Your task is to create the HTML structure for a website page.

IMPORTANT INSTRUCTIONS:
1. Generate ONLY the HTML content inside the <body> — DO NOT include <html>, <head>, or <body> tags.
2. Use semantic HTML5: header, nav, main, section, footer, etc.
3. Include IDs in sections: hero, about, services, contact, etc.
4. Use heading hierarchy (h1, h2, h3) and accessibility attributes.
5. Use placeholder text where needed.
6. Output must be clean, minimal, valid HTML.

DO NOT use <body> or <html> or <head> tags.
DO NOT wrap content in markdown code fences (no triple backticks).
Return only raw HTML that can be injected directly into an existing HTML document.`;

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
