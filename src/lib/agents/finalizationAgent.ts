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
  context: AgentContext
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

  const fullHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${plan.siteConfig?.name || "Site por IA"}</title>
  ${outputs.seo?.meta_tags || ""}
  <style>${css}</style>
</head>
<body>
  ${pageHtml}
  <script>${js}</script>
</body>
</html>
`.trim();

  return {
    html_code: pageHtml, // Apenas o conteúdo da <body>
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
