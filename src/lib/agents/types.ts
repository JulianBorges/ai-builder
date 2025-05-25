import { OpenAIModel } from "@/services/openai-service";

export type AgentContext = {
  prompt: string;
  siteType?: string;
  colorTheme?: string;
  target?: string;
  model: OpenAIModel;
};

export type AgentResponse<T = string> = {
  content: T;
  error?: string;
};

export type AgentFunction<T = string> = (context: AgentContext) => Promise<AgentResponse<T>>;

export type AgentOutput = {
  structure?: string;
  content?: string;
  design?: string;
  interactions?: string;
  seo?: string;
  finalHtml?: string;
};

export type AgentProgressCallback = (current: number, total: number, step: string) => void;