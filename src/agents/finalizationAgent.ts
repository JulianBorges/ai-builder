
import { AgentContext, AgentFunction, AgentOutput } from "./types";
import { openAIService } from "@/services/openai-service";

const SYSTEM_PROMPT = `You are a website finalization specialist. Your task is to 
combine separate components into a complete, valid HTML document.

IMPORTANT INSTRUCTIONS:
1. Combine the provided structure, content, styles, JavaScript, and meta tags into a single HTML file.
2. Ensure the final HTML is valid, well-formatted, and properly structured.
3. Place meta tags within the <head> section.
4. Place CSS within a <style> tag in the <head> section.
5. Place JavaScript within a <script> tag at the end of the <body> section.
6. Ensure all content is correctly placed within the structure.
7. Add any missing required tags (doctype, html, head, body).
8. Ensure proper indentation and formatting for readability.
9. Verify that the document includes viewport settings for responsiveness.
10. Make sure all open tags have corresponding closing tags.

RETURN A COMPLETE, VALID HTML DOCUMENT.`;

export const finalizationAgent: AgentFunction = async (context: AgentContext) => {
  try {
    // In a real scenario, we would have the outputs from previous agents
    // For now, we'll simulate that with a simple template string
    let result = '';
    
    await openAIService.generateWebsiteIdea(
      `Finalize a complete HTML document for a ${context.siteType || 'generic'} website based on the given components. ${context.prompt}`, 
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
    console.error("Finalization Agent Error:", error);
    return {
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error in finalization agent'
    };
  }
};

/**
 * Takes the outputs from all previous agents and combines them into a proper HTML document
 */
export const combineAgentOutputs = (outputs: AgentOutput): string => {
  // Basic HTML template
  let finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Website</title>
  ${outputs.seo || ''}
  <style>
    ${outputs.design || '/* No styles provided */'}
  </style>
</head>
<body>
  ${outputs.structure || '<div class="container">No structure provided</div>'}
  
  <script>
    ${outputs.interactions || '// No interactions provided'}
  </script>
</body>
</html>`;

  return finalHtml;
};
