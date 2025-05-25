
import { AgentContext, AgentFunction } from "./types";
import { openAIService } from "@/services/openai-service";

const SYSTEM_PROMPT = `You are an SEO specialist. Your task is to create 
meta tags and SEO improvements for a website.

IMPORTANT INSTRUCTIONS:
1. Generate ONLY the <head> section meta tags for SEO.
2. Include all essential meta tags: title, description, viewport, charset.
3. Add Open Graph tags for social media sharing.
4. Add Twitter Card tags.
5. Include canonical URL placeholder.
6. Add appropriate language and direction attributes.
7. Include a favicon placeholder link.
8. Add any other relevant meta tags for SEO optimization.
9. Ensure tags follow current SEO best practices.
10. Include comments to explain the purpose of different meta tag groups.

ONLY RETURN THE <head> CONTENT WITHOUT <head> TAGS THEMSELVES.`;

export const seoAgent: AgentFunction = async (context: AgentContext) => {
  try {
    let result = '';
    
    await openAIService.generateWebsiteIdea(
      `Create SEO meta tags for a ${context.siteType || 'generic'} website titled "${context.prompt}".`, 
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
    console.error("SEO Agent Error:", error);
    return {
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error in SEO agent'
    };
  }
};
