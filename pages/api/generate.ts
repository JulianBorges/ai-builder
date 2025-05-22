
import type { NextApiRequest, NextApiResponse } from 'next';
import { plannerAgent } from '@/lib/agents/plannerAgent';
import { orchestrator } from '@/lib/agents/orchestrator';
import { finalizationAgent } from '@/lib/agents/finalizationAgent';

export type GenerateRequestBody = {
  prompt: string;
  model?: string;
  temperature?: number;
  colorTheme?: string;
  target?: string;
  siteType?: string;
};

export type GenerateResponseBody = {
  html_code: string;
  files: Array<{
    path: string;
    content: string;
  }>;
  generation_plan: any;
  error?: string;
};

/**
 * API route handler for website generation
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerateResponseBody>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      html_code: '',
      files: [],
      generation_plan: null,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    const { 
      prompt, 
      model = 'gpt-4o', 
      temperature = 0.7,
      colorTheme,
      target,
      siteType
    } = req.body as GenerateRequestBody;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        html_code: '',
        files: [],
        generation_plan: null,
        error: 'Invalid or missing prompt in request body'
      });
    }

    // Set up the agent context
    const context = {
      prompt,
      model,
      temperature,
      colorTheme,
      target,
      siteType
    };

    console.log(`Generating website for prompt: "${prompt.substring(0, 50)}..."`);

    // Step 1: Plan the generation using the planner agent
    const planResponse = await plannerAgent(context);

    // Handle planner errors
    if (planResponse.error) {
      return res.status(500).json({
        html_code: '',
        files: [],
        generation_plan: planResponse.content,
        error: `Planner agent error: ${planResponse.error}`
      });
    }

    const plan = planResponse.content;

    // Step 2: Execute the plan using the orchestrator
    const orchestrationResult = await orchestrator(
      plan,
      context,
      (stage, current, total) => {
        // In a real implementation, this could update a progress indicator
        console.log(`Generation progress: ${stage} - ${current}/${total}`);
      }
    );

    // Step 3: Finalize the results
    const finalResult = await finalizationAgent(orchestrationResult, context);

    // Return the successful response
    return res.status(200).json({
      html_code: finalResult.html_code,
      files: finalResult.files,
      generation_plan: plan,
      error: undefined
    });
  } catch (error) {
    console.error('Website generation error:', error);
    
    return res.status(500).json({
      html_code: `<!DOCTYPE html>
<html>
<head><title>Error</title></head>
<body>
  <h1>Website Generation Error</h1>
  <p>${error instanceof Error ? error.message : 'An unknown error occurred'}</p>
</body>
</html>`,
      files: [],
      generation_plan: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
}
