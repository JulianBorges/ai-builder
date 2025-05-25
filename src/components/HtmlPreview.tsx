import React from 'react';
import { debugLog } from "@/utils/debugLog";

interface HtmlPreviewProps {
  htmlContent: string;
  cssContent?: string;
  className?: string;
}

const HtmlPreview: React.FC<HtmlPreviewProps> = ({ htmlContent, cssContent = '', className = '' }) => {
  debugLog("✅ HtmlPreview", "Rendering HTML content", htmlContent.length);

  // If htmlContent already contains a complete HTML document, use it directly
  // Otherwise, wrap it in a complete HTML structure
  const isCompleteHtml = htmlContent.includes('<!DOCTYPE html>') || htmlContent.includes('<html');
  
  const fullHtml = isCompleteHtml ? htmlContent : `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Preview</title>
        <style>${cssContent}</style>
      </head>
      <body>
        ${htmlContent}
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
