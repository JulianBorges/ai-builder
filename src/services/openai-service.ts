
import { toast } from "sonner";

// Tipos para a API da OpenAI
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIResponse {
  id: string;
  choices: {
    message: OpenAIMessage;
    finish_reason: string;
  }[];
}

// Opções de modelo disponíveis
export type OpenAIModel = 'gpt-4o-mini' | 'gpt-4o';

const SYSTEM_PROMPT = `You are an AI website builder assistant. 
Your job is to interpret user requests for website creation and provide detailed instructions on how to build the requested website.
Focus on understanding the type of website, its primary features, layout, and design preferences.
Be specific and detailed in your response.`;

export class OpenAIService {
  private apiKey: string | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || null;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateWebsiteIdea(prompt: string, model: OpenAIModel = 'gpt-4o-mini'): Promise<string> {
    if (!this.apiKey) {
      toast.error("API key is required. Please enter your OpenAI API key in settings.");
      throw new Error("API key is required");
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("OpenAI API error:", error);
        toast.error("Error generating website: " + (error.error?.message || "Unknown error"));
        throw new Error(error.error?.message || "Failed to generate website idea");
      }

      const data = await response.json() as OpenAIResponse;
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      toast.error("Error generating website: " + (error instanceof Error ? error.message : "Unknown error"));
      throw error;
    }
  }
}

// Cria uma instância do serviço para uso global
export const openAIService = new OpenAIService();
