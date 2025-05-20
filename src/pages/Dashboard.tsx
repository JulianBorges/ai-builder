import { useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Copy, 
  ArrowLeft, 
  ArrowRight,
  Save,
  Github
} from 'lucide-react';

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  const handleVersionRollback = (version: string) => {
    // Handle version rollback
    console.log(`Rolling back to version: ${version}`);
  };
  
  const codeExample = `// Example React component
import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-2">Counter: {count}</h2>
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
    </div>
  );
};

export default Counter;`;

  const historyVersions = [
    { id: '1', date: 'May 20, 2025 - 10:30 AM', changes: 'Initial layout created' },
    { id: '2', date: 'May 20, 2025 - 11:45 AM', changes: 'Added header and navigation' },
    { id: '3', date: 'May 20, 2025 - 2:15 PM', changes: 'Implemented responsive design' },
    { id: '4', date: 'May 20, 2025 - 4:00 PM', changes: 'Added product listing component' },
  ];

  return (
    <div className="min-h-screen pt-16 flex">
      <DashboardSidebar 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />
      
      <main className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
        {activeTab === 'editor' && (
          <div className="flex flex-col md:flex-row h-full">
            {/* Prompt Editor */}
            <div className="w-full md:w-1/2 border-r border-border p-4 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">AI Editor</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {/* Toggle fullscreen */}}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>
              
              <Tabs defaultValue="prompt" className="flex-1 flex flex-col">
                <TabsList className="mb-4">
                  <TabsTrigger value="prompt">AI Prompt</TabsTrigger>
                  <TabsTrigger value="components">Components</TabsTrigger>
                </TabsList>
                
                <TabsContent value="prompt" className="flex-1 flex flex-col space-y-4 mt-0">
                  <form onSubmit={handleAISubmit} className="flex-1 flex flex-col">
                    <Textarea
                      placeholder="Describe the changes you want to make..."
                      className="flex-1 resize-none border-border"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                    />
                    <div className="mt-4 flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">
                        Be specific about what you want to change
                      </p>
                      <Button 
                        type="submit"
                        disabled={!aiPrompt.trim() || isGenerating}
                        className="relative overflow-hidden"
                      >
                        {isGenerating ? (
                          'Generating...'
                        ) : (
                          <>
                            <Zap className="mr-2 h-4 w-4" />
                            Generate Changes
                          </>
                        )}
                        {isGenerating && (
                          <span className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse"></span>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="components" className="flex-1 mt-0">
                  <div className="h-full border rounded-md border-border p-4">
                    <h3 className="font-medium mb-3">Available Components</h3>
                    <p className="text-muted-foreground text-sm">
                      Component library will appear here
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Preview */}
            <div className="w-full md:w-1/2 flex flex-col h-full">
              <div className="flex justify-between items-center p-4">
                <h2 className="text-xl font-semibold">Preview</h2>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 border-t border-border p-4 bg-black/30">
                <div className="w-full h-full rounded border border-border overflow-hidden flex items-center justify-center bg-black/50">
                  <p className="text-muted-foreground">
                    Preview will appear here
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'code' && (
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Code Editor</h2>
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </Button>
            </div>
            
            <div className="flex-1 code-window overflow-auto">
              <pre className="text-green-400">{codeExample}</pre>
            </div>
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="p-6 h-full">
            <h2 className="text-xl font-semibold mb-6">Version History</h2>
            
            <div className="space-y-4">
              {historyVersions.map((version) => (
                <div 
                  key={version.id}
                  className="p-4 border border-border rounded-lg flex justify-between items-center hover:bg-secondary/20 transition-colors"
                >
                  <div>
                    <h3 className="font-medium">{version.date}</h3>
                    <p className="text-sm text-muted-foreground">{version.changes}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleVersionRollback(version.id)}
                    className="border-primary/30 hover:border-primary"
                  >
                    Restore
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="p-6 h-full">
            <h2 className="text-xl font-semibold mb-6">Project Settings</h2>
            
            <div className="space-y-6 max-w-2xl">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Name</label>
                <input 
                  type="text" 
                  defaultValue="E-commerce Site" 
                  className="w-full p-2 bg-secondary/50 border border-border rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  defaultValue="A modern e-commerce platform with product catalog and shopping cart" 
                  className="w-full bg-secondary/50 border border-border"
                />
              </div>
              
              <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-medium mb-4">GitHub Integration</h3>
                <Button className="border-primary/30 hover:border-primary">
                  <Github className="mr-2 h-4 w-4" />
                  Connect to GitHub
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
