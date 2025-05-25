
import React from 'react';
import { debugLog } from "@/utils/debugLog";

interface HtmlPreviewProps {
  htmlContent: string;
  cssContent?: string;
  className?: string;
}

const HtmlPreview: React.FC<HtmlPreviewProps> = ({ htmlContent, cssContent = '', className = '' }) => {
  debugLog("✅ HtmlPreview", "Rendering HTML content", htmlContent.length);

  // Clean the HTML content to ensure it's a proper fragment
  const cleanHtml = htmlContent
    .trim()
    .replace(/^```html\s*/g, '')
    .replace(/```\s*$/g, '')
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<html[^>]*>/gi, '')
    .replace(/<\/html>/gi, '')
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
    .replace(/<body[^>]*>/gi, '')
    .replace(/<\/body>/gi, '')
    .trim();

  // Check if we have a complete HTML document or just fragments
  const isCompleteHtml = htmlContent.includes('<!DOCTYPE html>');
  
  const fullHtml = isCompleteHtml ? htmlContent : `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Preview</title>
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
          
          ${cssContent}
        </style>
      </head>
      <body>
        ${cleanHtml}
      </body>
    </html>
  `;

  return (
    <iframe
      title="HTML Preview"
      srcDoc={fullHtml}
      className={`w-full h-full border-0 ${className}`}
      sandbox="allow-scripts allow-same-origin"
    />
  );
};

export default HtmlPreview;
