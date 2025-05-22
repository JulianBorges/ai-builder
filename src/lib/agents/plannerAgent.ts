
import { AgentContext, AgentResponse, GenerationPlan } from "./types";
import { openAIService } from "@/services/openai-service";

const PLANNER_SYSTEM_PROMPT = `You are an expert website architect and planner. 
Your task is to analyze the user's website request and create a detailed generation plan.

Based on the user's description, you should determine:
1. What pages should be created (e.g., home, about, services, contact)
2. What components would be needed (e.g., navigation, hero section, pricing table)
3. What styles should be defined
4. Any data structures required

The plan should be detailed enough to guide the generation of a complete website.

IMPORTANT: Return ONLY valid JSON conforming to the GenerationPlan type with no additional explanations.`;

/**
 * Planner agent that takes a user prompt and generates a structured website plan
 * 
 * @param context The agent context with user prompt and model settings
 * @returns A structured generation plan for building the website
 */
export const plannerAgent = async (
  context: AgentContext
): Promise<AgentResponse<GenerationPlan>> => {
  try {
    // Default site type if not specified
    const siteType = context.siteType || inferSiteType(context.prompt);
    
    let result = '';
    
    await openAIService.generateWebsiteIdea(
      `Create a detailed website generation plan for a ${siteType} website with the following description: ${context.prompt}`,
      context.model as any,
      (partialText) => {
        result = partialText;
      },
      PLANNER_SYSTEM_PROMPT
    );

    // Parse the result as JSON
    try {
      const plan = JSON.parse(result) as GenerationPlan;
      
      // Validate the plan structure
      validatePlan(plan);
      
      return {
        content: plan
      };
    } catch (parseError) {
      console.error("Failed to parse planner result as JSON:", parseError);
      return {
        content: createFallbackPlan(context),
        error: `Failed to parse planner result: ${parseError instanceof Error ? parseError.message : String(parseError)}`
      };
    }
  } catch (error) {
    console.error("Planner Agent Error:", error);
    return {
      content: createFallbackPlan(context),
      error: error instanceof Error ? error.message : 'Unknown error in planner agent'
    };
  }
};

/**
 * Infers the site type from the user prompt if not explicitly provided
 */
function inferSiteType(prompt: string): string {
  // Common site types to detect
  const siteTypes = [
    "portfolio", "blog", "ecommerce", "landing page", "restaurant", "coffee shop",
    "yoga studio", "fitness center", "spa", "hotel", "bakery", "nonprofit",
    "educational", "tech company", "law firm", "medical practice", "real estate"
  ];
  
  // Check if any site type is mentioned in the prompt
  const lowercasePrompt = prompt.toLowerCase();
  for (const type of siteTypes) {
    if (lowercasePrompt.includes(type.toLowerCase())) {
      return type;
    }
  }
  
  // Default fallback
  return "business";
}

/**
 * Validates that the plan has the required structure
 */
function validatePlan(plan: GenerationPlan): void {
  if (!plan.pages || !Array.isArray(plan.pages)) {
    throw new Error("Plan must include a pages array");
  }
  
  if (!plan.components || !Array.isArray(plan.components)) {
    throw new Error("Plan must include a components array");
  }
  
  if (!plan.styles || !Array.isArray(plan.styles)) {
    throw new Error("Plan must include a styles array");
  }
  
  if (!plan.siteConfig) {
    throw new Error("Plan must include siteConfig");
  }
}

/**
 * Creates a basic fallback plan when the planner fails
 */
function createFallbackPlan(context: AgentContext): GenerationPlan {
  const siteType = context.siteType || inferSiteType(context.prompt);
  
  return {
    pages: [
      {
        name: "home",
        path: "pages/index.tsx",
        components: ["Header", "Hero", "Footer"],
        sections: [
          {
            id: "hero",
            type: "hero",
            content: {
              heading: `Welcome to our ${siteType} site`,
              subheading: "We're here to serve you"
            }
          },
          {
            id: "features",
            type: "grid",
            content: {
              heading: "Our Features",
              items: [
                "Quality Service",
                "Professional Staff",
                "Great Experience"
              ]
            }
          }
        ],
        meta: {
          title: `${siteType.charAt(0).toUpperCase() + siteType.slice(1)} Site`,
          description: `A professional ${siteType} website`
        }
      },
      {
        name: "about",
        path: "pages/about.tsx",
        components: ["Header", "Footer"],
        sections: [
          {
            id: "about",
            type: "content",
            content: {
              heading: "About Us",
              body: `Learn more about our ${siteType} business.`
            }
          }
        ],
        meta: {
          title: "About Us",
          description: `Learn about our ${siteType} business and team`
        }
      },
      {
        name: "contact",
        path: "pages/contact.tsx",
        components: ["Header", "Footer"],
        sections: [
          {
            id: "contact",
            type: "form",
            content: {
              heading: "Contact Us",
              formFields: ["name", "email", "message"]
            }
          }
        ],
        meta: {
          title: "Contact Us",
          description: `Get in touch with our ${siteType} business`
        }
      }
    ],
    components: [
      {
        name: "Header",
        path: "components/Header.tsx"
      },
      {
        name: "Footer",
        path: "components/Footer.tsx"
      },
      {
        name: "Hero",
        path: "components/Hero.tsx"
      }
    ],
    styles: [
      {
        name: "globals",
        path: "styles/globals.css",
        type: "css"
      },
      {
        name: "variables",
        path: "styles/variables.css",
        type: "css"
      }
    ],
    siteConfig: {
      name: `${siteType.charAt(0).toUpperCase() + siteType.slice(1)} Website`,
      description: `A professional ${siteType} website`,
      primaryColor: "#3490dc",
      secondaryColor: "#ffed4a",
      typography: {
        headingFont: "Inter, sans-serif",
        bodyFont: "Inter, sans-serif"
      },
      layout: "responsive"
    }
  };
}
