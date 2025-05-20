
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

const SYSTEM_PROMPT = `Você é um web designer experiente especializado em criar sites sofisticados e elegantes. 
Seu trabalho é interpretar os pedidos do usuário e gerar um código HTML completo para o site solicitado.

INSTRUÇÕES IMPORTANTES:
1. Gere APENAS código HTML válido, incluindo CSS inline ou em uma tag <style>.
2. Crie designs modernos, visualmente atraentes e responsivos.
3. Implemente as melhores práticas de UX e UI para uma experiência de usuário excepcional.
4. Otimize o site para SEO com meta tags adequadas, estrutura semântica e boas práticas.
5. Inclua comentários no código para explicar seções importantes.
6. Certifique-se de que o site seja funcional, com navegação e elementos interativos quando aplicável.
7. Inclua todas as partes essenciais de um site completo: cabeçalho, navegação, conteúdo principal, rodapé.
8. Use fontes web seguras ou Google Fonts para tipografia atraente.
9. Utilize cores harmoniosas e elementos de design coesos.
10. NÃO inclua instruções ou explicações fora do código HTML - apenas retorne o código pronto para uso.

Responda APENAS com o código HTML completo (incluindo DOCTYPE, head, body, etc.) que pode ser diretamente visualizado em um navegador.`;

export class OpenAIService {
  private apiKey: string | null = null;
  private abortController: AbortController | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || localStorage.getItem('openai_api_key');
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
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
    onPartialResponse?: (text: string) => void
  ): Promise<string> {
    if (!this.apiKey) {
      toast.error("API key is required. Please enter your OpenAI API key in settings.");
      throw new Error("API key is required");
    }

    // Cancel any ongoing request
    this.cancelCurrentRequest();
    
    // Create a new abort controller for this request
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
              content: SYSTEM_PROMPT
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 4000,
          temperature: 0.7,
          stream: !!onPartialResponse, // Only stream if we have a callback
        }),
        signal
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("OpenAI API error:", error);
        toast.error("Error generating website: " + (error.error?.message || "Unknown error"));
        throw new Error(error.error?.message || "Failed to generate website idea");
      }

      // Handle streaming response if needed
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
          
          // Process all complete events in buffer
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
      } 
      else {
        // Handle regular JSON response
        const data = await response.json() as OpenAIResponse;
        return data.choices[0].message.content;
      }
    } catch (error: any) {
      // Don't show error if it's an abort error
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

// Cria uma instância do serviço para uso global
export const openAIService = new OpenAIService();
