
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface AIPromptPanelProps {
  onSubmitPrompt?: (prompt: string) => void;
  onGeneratedContent?: (content: string) => void;
  isGenerating?: boolean;
}

export const AIPromptPanel = ({
  onSubmitPrompt = () => {},
  onGeneratedContent = () => {},
  isGenerating = false,
}: AIPromptPanelProps) => {
  const [prompt, setPrompt] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmitPrompt(prompt);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 flex-1">
        <Label htmlFor="prompt">Ask a follow up...</Label>
        <Textarea
          id="prompt"
          placeholder="Ask any questions about the code or request changes..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 min-h-[200px] resize-none"
        />
        <div className="flex justify-end">
          <Button 
            type="submit"
            disabled={isGenerating || !prompt.trim()} 
            className="mt-2"
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </form>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Console</h3>
        <div className="text-xs p-2 bg-secondary/50 rounded-md h-24 overflow-y-auto">
          <pre>v0 may make mistakes. Please use with discretion.</pre>
        </div>
      </div>
    </div>
  );
};

export default AIPromptPanel;
