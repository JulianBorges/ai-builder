
import React, { useEffect, useState } from 'react';
import { Check, AlertTriangle, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HtmlQualityIndicatorProps {
  htmlContent: string;
}

const HtmlQualityIndicator: React.FC<HtmlQualityIndicatorProps> = ({ htmlContent }) => {
  const [quality, setQuality] = useState<'good' | 'warning' | 'poor' | null>(null);
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    if (!htmlContent) {
      setQuality(null);
      setIssues([]);
      return;
    }

    const newIssues: string[] = [];
    
    // Check for proper HTML structure
    if (!htmlContent.includes('<!DOCTYPE html>')) {
      newIssues.push('Missing DOCTYPE declaration');
    }
    
    if (!htmlContent.includes('<html')) {
      newIssues.push('Missing <html> tag');
    }
    
    if (!htmlContent.includes('<head>')) {
      newIssues.push('Missing <head> tag');
    }
    
    if (!htmlContent.includes('<meta name="viewport"')) {
      newIssues.push('Missing viewport meta tag');
    }
    
    if (!htmlContent.includes('<meta name="description"')) {
      newIssues.push('Missing description meta tag');
    }
    
    if (!htmlContent.includes('<style>') && !htmlContent.includes('style=')) {
      newIssues.push('No styling detected');
    }
    
    if (!htmlContent.includes('@media')) {
      newIssues.push('No media queries for responsiveness');
    }

    // Determine quality based on issue count
    if (newIssues.length === 0) {
      setQuality('good');
    } else if (newIssues.length <= 2) {
      setQuality('warning');
    } else {
      setQuality('poor');
    }

    setIssues(newIssues);
  }, [htmlContent]);

  if (!quality) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-2 px-2 py-1 text-xs rounded-md">
            {quality === 'good' && (
              <div className="flex items-center text-green-500">
                <Check className="w-4 h-4 mr-1" />
                <span>Quality: Good</span>
              </div>
            )}
            {quality === 'warning' && (
              <div className="flex items-center text-yellow-500">
                <AlertTriangle className="w-4 h-4 mr-1" />
                <span>Quality: Needs Improvement</span>
              </div>
            )}
            {quality === 'poor' && (
              <div className="flex items-center text-red-500">
                <X className="w-4 h-4 mr-1" />
                <span>Quality: Poor</span>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          {issues.length > 0 ? (
            <div>
              <p className="font-medium mb-1">Issues detected:</p>
              <ul className="list-disc pl-4 space-y-1">
                {issues.map((issue, index) => (
                  <li key={index} className="text-xs">{issue}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No issues detected. The generated HTML includes proper structure, meta tags, and responsive design.</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HtmlQualityIndicator;
