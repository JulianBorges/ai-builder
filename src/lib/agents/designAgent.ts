
import { AgentContext, AgentFunction } from "./types";
import { openAIService } from "@/services/openai-service";
import { debugLog } from "@/utils/debugLog";

const SYSTEM_PROMPT = `You are a website design specialist. Your task is to create 
beautiful, responsive CSS styles for a website.

IMPORTANT INSTRUCTIONS:
1. Generate ONLY the CSS code (no <style> tag).
2. Design must be responsive: mobile-first with media queries.
3. Use modern layout techniques: CSS Grid, Flexbox, spacing and padding.
4. Create a professional and accessible visual hierarchy.
5. Typography must be clean and readable.
6. Use a coherent, visually pleasant color palette suitable to the site type.
7. Include styling for sections, headings, paragraphs, buttons, and lists.
8. Animations and transitions can be included subtly to enhance interactivity.
9. Do not use classes like .container or .box without styling them.
10. Return clean, maintainable CSS organized by sections with comments.

ONLY RETURN CSS CODE WITHOUT <style> TAGS.`;

export const designAgent: AgentFunction = async (context: AgentContext) => {
  try {
    let result = '';
    
    await openAIService.generateWebsiteIdea(
      `Create CSS styles for a ${context.siteType || 'generic'} website. Color theme: ${context.colorTheme || 'professional, modern'}. ${context.prompt}`, 
      context.model,
      (partialText) => {
        result = partialText;
      },
      SYSTEM_PROMPT
    );
    
    debugLog("🎨 CSS gerado", result);
    
    return {
      content: result,
      css: result
    };
  } catch (error) {
    debugLog("❌ Design Agent Error", error);
    return {
      content: '',
      css: '',
      error: error instanceof Error ? error.message : 'Unknown error in design agent'
    };
  }
};
