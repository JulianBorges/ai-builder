
import { debugLog } from "@/utils/debugLog";
import {
  AgentContext,
  FinalizationInput,
  FinalizationResult,
  OrchestrationResult,
} from "./types";

function injectContentIntoHTML(html: string, contentMap: Record<string, string>): string {
  return html.replace(/<section id="([^"]+)"[^>]*>[\s\S]*?<\/section>/g, (match, id) => {
    const content = contentMap[id]?.trim();
    if (content) {
      return `<section id="${id}">\n${content}\n</section>`;
    }
    return match;
  });
}

export const finalizationAgent = async (
  input: FinalizationInput | OrchestrationResult,
  context?: AgentContext
): Promise<FinalizationResult> => {
  const plan = input.plan;
  const outputs = "agentOutputs" in input ? input.agentOutputs : {};
  const css = "css" in input ? input.css : "";
  const js = "javascript" in input ? input.javascript : "";
  const htmlMap = "html" in input ? input.html : {};
  const content = "content" in input ? input.content : {};

  const firstPage = plan.pages[0];
  const firstPageName = firstPage?.name || "home";
  let pageHtml = htmlMap[firstPageName] || "<main>Conteúdo não disponível</main>";

  pageHtml = injectContentIntoHTML(pageHtml, content);

  debugLog("🧬 finalizationAgent - HTML com conteúdo injetado", pageHtml);

  // Create a complete, valid HTML document for preview
  const fullHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${plan.siteConfig?.name || "Site por IA"}</title>
  ${outputs.seo?.meta_tags || ""}
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    header {
      background: #2563eb;
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
    }
    
    .nav-links {
      display: flex;
      list-style: none;
      gap: 2rem;
    }
    
    .nav-links a {
      color: white;
      text-decoration: none;
      transition: opacity 0.3s;
    }
    
    .nav-links a:hover {
      opacity: 0.8;
    }
    
    main {
      min-height: calc(100vh - 120px);
    }
    
    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 0;
      text-align: center;
    }
    
    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }
    
    .hero p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }
    
    .btn {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: background 0.3s;
    }
    
    .btn:hover {
      background: #059669;
    }
    
    .section {
      padding: 4rem 0;
    }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }
    
    .card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }
    
    .card:hover {
      transform: translateY(-5px);
    }
    
    footer {
      background: #1f2937;
      color: white;
      text-align: center;
      padding: 2rem 0;
    }
    
    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2rem;
      }
      
      .nav-links {
        gap: 1rem;
      }
      
      .grid {
        grid-template-columns: 1fr;
      }
    }
    
    ${css}
  </style>
</head>
<body>
  ${pageHtml}
  
  <script>
    // Simple interactivity
    document.addEventListener('DOMContentLoaded', function() {
      // Add smooth scrolling to anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
      
      // Add click handlers to buttons
      document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          if (!this.href || this.href === '#') {
            e.preventDefault();
            console.log('Button clicked:', this.textContent);
          }
        });
      });
    });
    
    ${js}
  </script>
</body>
</html>`;

  return {
    html_code: fullHtml, // Return complete HTML document for preview
    css,
    files: [
      {
        name: "index.html",
        content: fullHtml,
        type: "text/html"
      },
      {
        name: "style.css",
        content: css,
        type: "text/css"
      },
      {
        name: "script.js",
        content: js,
        type: "text/javascript"
      }
    ],
    agent_outputs: outputs
  };
};
