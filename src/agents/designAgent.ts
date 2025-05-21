
import { AgentContext, AgentFunction } from "./types";
import { openAIService } from "@/services/openai-service";

const SYSTEM_PROMPT = `You are a website design specialist. Your task is to create 
beautiful, responsive CSS styles for a website.

IMPORTANT INSTRUCTIONS:
1. Generate ONLY CSS code to be included in a <style> tag.
2. Create mobile-first responsive design using media queries.
3. Use a coherent color scheme appropriate to the website type.
4. Design should include typography, spacing, colors, and layout.
5. Use modern CSS practices: CSS variables, flexbox/grid, etc.
6. Include subtle animations or transitions for interactive elements.
7. Ensure good visual hierarchy and readability.
8. Optimize for different screen sizes (mobile, tablet, desktop).
9. Include comments to explain different style sections.
10. Styles should be clean, maintainable and well-organized.

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
    
    return {
      content: result
    };
  } catch (error) {
    console.error("Design Agent Error:", error);
    return {
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error in design agent'
    };
  }
};
