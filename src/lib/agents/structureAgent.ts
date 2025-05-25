
import { AgentContext, AgentFunction } from "./types";
import { openAIService } from "@/services/openai-service";
import { debugLog } from "@/utils/debugLog";

const SYSTEM_PROMPT = `You are a website structure specialist. Your task is to create 
the HTML structure for a website page.

IMPORTANT INSTRUCTIONS:
1. Generate ONLY the HTML structure (semantic HTML5).
2. Use proper semantic tags: header, nav, main, section, article, aside, footer.
3. Include appropriate section IDs for content injection.
4. Create a responsive, accessible structure.
5. Use placeholder content where needed.
6. Include proper heading hierarchy (h1, h2, h3, etc.).
7. Add appropriate ARIA labels and accessibility attributes.
8. Structure should be mobile-first and responsive.
9. Include sections like: hero, about, services, contact, etc. as appropriate.
10. Return clean, well-formatted HTML.

ONLY RETURN HTML STRUCTURE WITHOUT <html> or <head> TAGS.`;

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
