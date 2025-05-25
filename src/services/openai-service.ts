
import { toast } from "sonner";
import { env } from "@/config/env";

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

const DEFAULT_SYSTEM_PROMPT = `You are an expert web designer specialized in creating sophisticated and elegant websites.
Your task is to interpret the user's request and generate complete HTML code for the requested website.

CRITICAL INSTRUCTIONS:
1. Generate ONLY valid HTML code that can be directly rendered in a browser.
2. Always include the complete structure: <!DOCTYPE html>, <html>, <head> with meta tags, <title>, and <body>.
3. Create modern, visually appealing designs using a mobile-first approach.
4. Use responsive design principles with media queries to ensure the site looks excellent on all devices.
5. Apply professional typography using system fonts or Google Fonts (with proper imports).
6. Implement a cohesive color scheme with harmonious colors (use CSS variables for consistency).
7. Include proper meta tags for SEO optimization (title, description, viewport, etc.).
8. Structure content semantically with appropriate HTML5 elements (header, nav, main, section, article, footer).
9. Add meaningful comments to explain the purpose of different sections.
10. Include all CSS in a <style> tag within the <head> section.
11. Use clean, maintainable CSS with logical organization (reset, variables, layout, components, utilities).
12. Implement subtle animations and transitions where appropriate to enhance user experience.
13. Ensure the site has proper navigation and clear information hierarchy.
14. Add placeholder content that makes sense for the requested site type.
15. Make interactive elements (buttons, forms, etc.) appear functional even if they don't have backend functionality.

ONLY RETURN VALID HTML CODE - no explanations, markdown, or other text outside the HTML.`;

export class OpenAIService {
  private apiKey: string | null = null;
  private abortController: AbortController | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || env.OPENAI_API_KEY || null;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('openai_api_key', apiKey);
  }

  getApiKey(): string | null {
    return this.apiKey;
  }

  cancelCurrentRequest() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  async generateWebsiteIdea(
    prompt: string,
    model: OpenAIModel = 'gpt-4o-mini',
    onPartialResponse?: (text: string) => void,
    systemPrompt: string = DEFAULT_SYSTEM_PROMPT
  ): Promise<string> {
    if (!this.apiKey) {
      toast.error("API key is required. Please enter your OpenAI API key in settings.");
      throw new Error("API key is required");
    }

    this.cancelCurrentRequest();
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

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
              content: systemPrompt
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: env.MAX_TOKENS || 4000,
          temperature: env.DEFAULT_TEMPERATURE || 0.7,
          stream: !!onPartialResponse,
        }),
        signal
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("OpenAI API error:", error);
        toast.error("Error generating website: " + (error.error?.message || "Unknown error"));
        throw new Error(error.error?.message || "Failed to generate website idea");
      }

      if (onPartialResponse && response.headers.get("content-type")?.includes("text/event-stream")) {
        const reader = response.body?.getReader();
        if (!reader) throw new Error("Failed to get response reader");

        let fullText = '';
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const json = JSON.parse(data);
                const content = json.choices[0]?.delta?.content || '';
                if (content) {
                  fullText += content;
                  onPartialResponse(fullText);
                }
              } catch (e) {
                console.error("Error parsing SSE:", e);
              }
            }
          }
        }

        return fullText;
      } else {
        const data = await response.json() as OpenAIResponse;
        return data.choices[0].message.content;
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request was cancelled');
        return '';
      }

      console.error("Error calling OpenAI:", error);
      toast.error("Error generating website: " + (error instanceof Error ? error.message : "Unknown error"));
      throw error;
    } finally {
      this.abortController = null;
    }
  }
}

export const openAIService = new OpenAIService();
