
import { structureAgent } from './structureAgent';
import { contentAgent } from './contentAgent';
import { designAgent } from './designAgent';
import { interactionsAgent } from './interactionsAgent';
import { seoAgent } from './seoAgent';
import { finalizationAgent, combineAgentOutputs } from './finalizationAgent';
import { AgentContext, AgentOutput, AgentProgressCallback } from './types';

/**
 * Orchestrates the execution of all agents in sequence
 */
export const runAgentPipeline = async (
  context: AgentContext,
  onProgress?: AgentProgressCallback
): Promise<string> => {
  const outputs: AgentOutput = {};
  const totalSteps = 6;
  
  try {
    // Step 1: Structure
    onProgress?.(1, totalSteps, 'Generating site structure...');
    const structureResponse = await structureAgent(context);
    if (structureResponse.error) throw new Error(structureResponse.error);
    outputs.structure = structureResponse.content;
    
    // Step 2: Content
    onProgress?.(2, totalSteps, 'Creating content...');
    const contentResponse = await contentAgent(context);
    if (contentResponse.error) throw new Error(contentResponse.error);
    outputs.content = contentResponse.content;
    
    // Step 3: Design
    onProgress?.(3, totalSteps, 'Designing styles...');
    const designResponse = await designAgent(context);
    if (designResponse.error) throw new Error(designResponse.error);
    outputs.design = designResponse.content;
    
    // Step 4: Interactions
    onProgress?.(4, totalSteps, 'Adding interactions...');
    const interactionsResponse = await interactionsAgent(context);
    if (interactionsResponse.error) throw new Error(interactionsResponse.error);
    outputs.interactions = interactionsResponse.content;
    
    // Step 5: SEO
    onProgress?.(5, totalSteps, 'Optimizing for search engines...');
    const seoResponse = await seoAgent(context);
    if (seoResponse.error) throw new Error(seoResponse.error);
    outputs.seo = seoResponse.content;
    
    // Step 6: Finalization
    onProgress?.(6, totalSteps, 'Finalizing website...');
    // Two approaches:
    // 1. Use the finalization agent for a complete solution
    const finalResponse = await finalizationAgent({
      ...context,
      prompt: `${context.prompt}\n\nStructure: ${outputs.structure?.substring(0, 100)}...\nContent: ${outputs.content?.substring(0, 100)}...\nDesign: ${outputs.design?.substring(0, 100)}...\nInteractions: ${outputs.interactions?.substring(0, 100)}...\nSEO: ${outputs.seo?.substring(0, 100)}...`
    });
    
    if (finalResponse.error) {
      // 2. Fallback: Use the local combiner function if the agent fails
      outputs.finalHtml = combineAgentOutputs(outputs);
      return outputs.finalHtml;
    }
    
    return finalResponse.content;
  } catch (error) {
    console.error("Agent Pipeline Error:", error);
    // Attempt to recover by combining what we have
    outputs.finalHtml = combineAgentOutputs(outputs);
    return outputs.finalHtml || `<html><body><h1>Error generating website</h1><p>${error}</p></body></html>`;
  }
};
