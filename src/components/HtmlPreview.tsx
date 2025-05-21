
import React, { useEffect, useRef } from 'react';

interface HtmlPreviewProps {
  htmlContent: string;
  className?: string;
}

const HtmlPreview: React.FC<HtmlPreviewProps> = ({ htmlContent, className = '' }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && htmlContent) {
      const iframe = iframeRef.current;
      const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDocument) {
        iframeDocument.open();
        iframeDocument.write(htmlContent);
        iframeDocument.close();
        
        // Add event listeners for responsive design testing if needed
        const handleIframeLoad = () => {
          // Any post-load initialization can go here
          console.log('Preview iframe loaded successfully');
        };
        
        iframe.onload = handleIframeLoad;
      }
    }
  }, [htmlContent]);

  return (
    <iframe
      ref={iframeRef}
      title="HTML Preview"
      className={`w-full h-full border-0 ${className}`}
      sandbox="allow-same-origin allow-scripts"
    />
  );
};

export default HtmlPreview;
