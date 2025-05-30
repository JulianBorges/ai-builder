
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Zap } from 'lucide-react';

interface AIPromptBoxProps {
  className?: string;
  fullWidth?: boolean;
}

const AIPromptBox = ({ className = "", fullWidth = false }: AIPromptBoxProps) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      setPrompt('');
      // Here you would navigate to the dashboard with the new project
    }, 1500);
  };

  return (
    <Card className={`glass-card overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <Textarea
            placeholder="Describe your website or app idea..."
            className={`border-0 bg-transparent rounded-t-md resize-none text-foreground ${fullWidth ? "h-36" : "h-24"}`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="p-3 bg-secondary/50 flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Be as detailed as possible for best results
            </p>
            <Button 
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className="relative overflow-hidden"
            >
              {isGenerating ? (
                'Generating...'
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
              {isGenerating && (
                <span className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse-glow"></span>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AIPromptBox;
