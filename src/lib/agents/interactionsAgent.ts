
import { AgentContext, AgentFunction } from "./types";
import { openAIService } from "@/services/openai-service";
import { debugLog } from "@/utils/debugLog";

const SYSTEM_PROMPT = `You are a website interactivity specialist. Your task is to create 
JavaScript code that adds interactivity to a website.

IMPORTANT INSTRUCTIONS:
1. Generate ONLY JavaScript code to be included in a <script> tag.
2. Create clean, vanilla JavaScript without requiring external libraries.
3. Include functions for common interactions: mobile menu toggle, smooth scrolling, form validation, etc.
4. Ensure the code is robust with error handling.
5. Make sure code runs after the DOM is fully loaded.
6. Include comments to explain functionality.
7. Code should be optimized and non-blocking.
8. Implement basic animations or transitions where appropriate.
9. Ensure all interactive elements have appropriate accessibility attributes.
10. Use ES6+ features but maintain broad browser compatibility.

ONLY RETURN JAVASCRIPT CODE WITHOUT <script> TAGS.`;

export const interactionsAgent: AgentFunction = async (context: AgentContext) => {
  try {
    let result = '';
    
    await openAIService.generateWebsiteIdea(
      `Create JavaScript interactions for a ${context.siteType || 'generic'} website. ${context.prompt}`, 
      context.model,
      (partialText) => {
        result = partialText;
      },
      SYSTEM_PROMPT
    );
    
    debugLog("⚙️ JS Interações", result);
    
    return {
      content: result,
      javascript: result
    };
  } catch (error) {
    debugLog("❌ Interactions Agent Error", error);
    return {
      content: '',
      javascript: '',
      error: error instanceof Error ? error.message : 'Unknown error in interactions agent'
    };
  }
};
