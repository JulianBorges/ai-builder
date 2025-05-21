
import React from 'react';
import HtmlPreview from './HtmlPreview';
import HtmlQualityIndicator from './HtmlQualityIndicator';

interface PreviewPanelProps {
  generatedCode: string;
}

export const PreviewPanel = ({ generatedCode }: PreviewPanelProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Preview</span>
        </div>
        <HtmlQualityIndicator htmlContent={generatedCode} />
      </div>
      
      <div className="flex-1 bg-[#F6F8FB] dark:bg-[#111] flex items-center justify-center">
        {generatedCode ? (
          <div className="w-full h-full">
            <HtmlPreview htmlContent={generatedCode} />
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <h2 className="text-2xl font-bold">Hello World</h2>
            <p className="mt-2">Get started by editing <code className="bg-muted px-1 py-0.5 rounded text-sm">app/page.tsx</code></p>
            <Button className="mt-4 bg-black text-white dark:bg-white dark:text-black">Button</Button>
          </div>
        )}
      </div>
    </div>
  );
};

// This is needed for the empty state
const Button = ({ className, children }: { className?: string, children: React.ReactNode }) => {
  return (
    <button className={`px-4 py-2 rounded-md ${className}`}>
      {children}
    </button>
  );
};

export default PreviewPanel;
