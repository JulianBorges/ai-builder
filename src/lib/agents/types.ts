
import { OpenAIModel } from "@/services/openai-service";

export type AgentContext = {
  prompt: string;
  siteType?: string;
  colorTheme?: string;
  target?: string;
  model: OpenAIModel;
  page?: any;
  plan?: GenerationPlan;
  structure?: string;
};

export type AgentResponse<T = string> = {
  content: T;
  error?: string;
};

export type AgentFunction<T = string> = (context: AgentContext) => Promise<AgentResponse<T>>;

export type GenerationPlan = {
  pages: Array<{
    name: string;
    path: string;
    components: string[];
    sections: string[];
    meta: {
      title: string;
      description: string;
    };
  }>;
  components: Array<{
    name: string;
    path: string;
  }>;
  styles: Array<{
    name: string;
    path: string;
    type: string;
  }>;
  siteConfig: {
    name: string;
    description: string;
    primaryColor: string;
    secondaryColor: string;
    typography: {
      headingFont: string;
      bodyFont: string;
    };
    layout: string;
  };
};

export type OrchestrationResult = {
  html: Record<string, string>;
  css: string;
  javascript: string;
  files: Array<{
    name: string;
    content: string;
    type: string;
  }>;
  plan: GenerationPlan;
  agentOutputs: Record<string, any>;
  content?: Record<string, string>;
};

export type FinalizationInput = {
  plan: GenerationPlan;
  css: string;
  javascript: string;
  html: Record<string, string>;
  agentOutputs: Record<string, any>;
  content?: Record<string, string>;
};

export type FinalizationResult = {
  html_code: string;
  css: string;
  files: Array<{
    name: string;
    content: string;
    type: string;
  }>;
  agent_outputs: Record<string, any>;
};

export type AgentProgressCallback = (current: number, total: number, step: string) => void;
export type ProgressCallback = (step: string, current: number, total: number, partialHtml?: any) => void;

export type AgentOutput = {
  structure?: string;
  content?: string;
  design?: string;
  interactions?: string;
  seo?: string;
  finalHtml?: string;
};
