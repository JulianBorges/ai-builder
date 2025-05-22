
/**
 * Common types for the AI website builder agent system
 */

// Main input context for all agents
export interface AgentContext {
  prompt: string;
  model: string;
  temperature?: number;
  target?: string; // Target audience
  colorTheme?: string; // Color scheme preference
  siteType?: string; // E.g. "coffee shop", "portfolio", "ecommerce"
}

// Agent response format
export interface AgentResponse<T> {
  content: T;
  error?: string;
}

// Common agent function type
export type Agent<T> = (context: AgentContext) => Promise<AgentResponse<T>>;

// Generation plan structure returned by planner
export interface GenerationPlan {
  pages: PageDefinition[];
  components: ComponentDefinition[];
  styles: StyleDefinition[];
  data?: DataDefinition[];
  siteConfig: SiteConfiguration;
}

export interface PageDefinition {
  name: string; // e.g. "home", "about"
  path: string; // e.g. "pages/index.tsx", "pages/about.tsx"
  components: string[]; // References to components this page uses
  sections: SectionDefinition[]; // Logical sections of the page
  meta: {
    title: string;
    description: string;
    [key: string]: string;
  };
}

export interface SectionDefinition {
  id: string; // e.g. "hero", "features", "testimonials"
  type: string; // e.g. "hero", "grid", "carousel"
  content?: Object; // Content placeholders
}

export interface ComponentDefinition {
  name: string; // e.g. "Header", "Button"
  path: string; // e.g. "components/Header.tsx"
  props?: string[]; // Expected props
  variant?: string; // e.g. "primary", "secondary"
}

export interface StyleDefinition {
  name: string; // e.g. "globals", "variables"
  path: string; // e.g. "styles/globals.css"
  type: "css" | "scss" | "module";
}

export interface DataDefinition {
  name: string;
  type: "json" | "ts";
  path: string;
}

export interface SiteConfiguration {
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  layout: "static" | "responsive" | "mobile-first";
}

// Orchestration result structure
export interface OrchestrationResult {
  html: {
    [pageId: string]: string; // Page ID -> HTML content mapping
  };
  css: string;
  javascript: string;
  files: Array<{
    path: string;
    content: string;
  }>;
  plan: GenerationPlan;
  agentOutputs: {
    [key: string]: any; // Agent results by stage
  };
}

// Progress tracking callback
export type ProgressCallback = (stage: string, progress: number, total: number) => void;

// New types for finalization agent

export interface AgentOutputs {
  structure?: { [pageId: string]: any };
  content?: { [pageId: string]: any };
  design?: any;
  interactions?: any;
  seo?: any;
}

export interface FinalizationInput {
  plan: GenerationPlan;
  agentOutputs: AgentOutputs;
  html?: { [pageId: string]: string };
  css?: string;
  javascript?: string;
}

export interface FinalizationResult {
  html_code: string; // Complete HTML document for preview
  files: Array<{
    path: string;
    content: string;
  }>;
  agent_outputs?: AgentOutputs;
}
