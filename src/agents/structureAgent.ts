
import { AgentContext, AgentFunction } from "./types";
import { openAIService } from "@/services/openai-service";

const SYSTEM_PROMPT = `You are a website structure specialist. Your task is to create a semantic HTML5 structure 
for a website WITHOUT any content, styling or scripts.

IMPORTANT INSTRUCTIONS:
1. Only generate the HTML skeleton/structure using semantic HTML5 elements.
2. Use proper tags like <header>, <nav>, <main>, <section>, <article>, <aside>, <footer> etc.
3. Create a logical hierarchical structure.
4. Include all necessary container divs with descriptive class names.
5. Include empty placeholders for content (but do NOT add any actual content).
6. Do NOT include any CSS or JavaScript.
7. Include comments to explain the purpose of different sections.
8. DO NOT include any placeholder text - leave elements empty where content would go.
9. Include a basic responsive structure with appropriate container classes.
10. Make sure the HTML is properly indented and organized.

ONLY RETURN THE HTML STRUCTURE WITHOUT <!DOCTYPE>, <html>, <head>, or <body> tags.`;

export const structureAgent: AgentFunction = async (context: AgentContext) => {
  try {
    let result = '';
    
    await openAIService.generateWebsiteIdea(
      `Create a semantic HTML5 structure for a ${context.siteType || 'generic'} website. ${context.prompt}`, 
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
    console.error("Structure Agent Error:", error);
    return {
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error in structure agent'
    };
  }
};
