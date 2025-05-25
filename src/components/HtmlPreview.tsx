import React, { useEffect, useRef } from 'react';
import { debugLog } from "@/utils/debugLog";

interface HtmlPreviewProps {
  htmlContent: string;
  cssContent?: string;
  className?: string;
}

const HtmlPreview: React.FC<HtmlPreviewProps> = ({ htmlContent, cssContent = '', className = '' }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      debugLog("✅ HtmlPreview", "Preview iframe carregado com sucesso");

      const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDocument) return;

      const fullHtml = `
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

      iframeDocument.open();
      iframeDocument.write(fullHtml);
      iframeDocument.close();
    };

    // Aguardar carregamento seguro do iframe
    iframe.onload = handleLoad;
  }, [htmlContent, cssContent]);

  return (
    <iframe
      ref={iframeRef}
      title="HTML Preview"
      className={`w-full h-full border-0 ${className}`}
      sandbox="allow-scripts"
    />
  );
};

export default HtmlPreview;
