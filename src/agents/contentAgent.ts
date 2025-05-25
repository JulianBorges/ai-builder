
import { AgentContext, AgentFunction } from "./types";
import { openAIService } from "@/services/openai-service";

const SYSTEM_PROMPT = `You are a website content specialist. Your task is to create engaging, 
relevant content to fill a pre-existing HTML structure.

IMPORTANT INSTRUCTIONS:
1. Generate ONLY the content (text, buttons, CTAs) for a website - not the HTML structure itself.
2. Create appropriate headings, paragraphs, list items, button text, etc.
3. The content should be engaging, professional and relevant to the website type.
4. Adapt your tone and vocabulary to the website's purpose and target audience.
5. Provide realistic, useful text - not generic placeholders.
6. Include calls-to-action where appropriate.
7. Content should be concise but complete.
8. Organize your response as sections of content that will be inserted into the HTML structure.
9. Format your response as JSON with keys representing sections (e.g. header, hero, about, services, etc.)

RETURN ONLY JSON WITH SECTION CONTENT, NOT HTML.`;

export const contentAgent: AgentFunction = async (context: AgentContext) => {
  try {
    let result = '';
    
    await openAIService.generateWebsiteIdea(
      `Create content for a ${context.siteType || 'generic'} website. Target audience: ${context.target || 'general'}. Details: ${context.prompt}`, 
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
    console.error("Content Agent Error:", error);
    return {
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error in content agent'
    };
  }
};
