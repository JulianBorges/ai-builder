
import { AgentContext, AgentFunction } from "./types";
import { openAIService } from "@/services/openai-service";
import { debugLog } from "@/utils/debugLog";

const SYSTEM_PROMPT = `You are a website structure specialist. 
Your task is to create the HTML structure for a website page.

CRITICAL INSTRUCTIONS:
1. Generate ONLY the inner HTML content - NO <html>, <head>, or <body> tags
2. Start directly with semantic elements like <header>, <main>, <section>, <footer>
3. Use semantic HTML5: header, nav, main, section, footer, etc.
4. Include meaningful IDs in sections: hero, about, services, contact, etc.
5. Use heading hierarchy (h1, h2, h3) and accessibility attributes
6. Use placeholder text where needed
7. DO NOT wrap in markdown code blocks (no triple backticks)
8. DO NOT include DOCTYPE, html, head, or body tags
9. Return only clean HTML that can be injected directly into a body element

Example output:
<header>
  <nav>
    <div class="container">
      <!-- navigation content -->
    </div>
  </nav>
</header>
<main>
  <section id="hero">
    <!-- hero content -->
  </section>
</main>

Return ONLY the inner HTML structure.`;

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

    // Clean up any potential markdown or unwanted tags
    result = result
      .trim()
      .replace(/^```html\s*/g, '')
      .replace(/```\s*$/g, '')
      .replace(/<!DOCTYPE[^>]*>/gi, '')
      .replace(/<html[^>]*>/gi, '')
      .replace(/<\/html>/gi, '')
      .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
      .replace(/<body[^>]*>/gi, '')
      .replace(/<\/body>/gi, '')
      .trim();
   
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
