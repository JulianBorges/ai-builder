import React, { useState } from 'react';
import VersionSidebar from './VersionSidebar';
import ActionBar from './ActionBar';
import UserSidebar from './UserSidebar';
import AIPromptPanel from './AIPromptPanel';
import PreviewPanel from './PreviewPanel';
import { openAIService } from '@/services/openai-service';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface V0DashboardProps {
  projectName?: string;
  userName?: string;
  userEmail?: string;
  userAvatarUrl?: string;
}

export const V0Dashboard = ({
  projectName = "Next.js + shadcn/ui",
  userName = "User",
  userEmail = "",
  userAvatarUrl = "",
}: V0DashboardProps) => {
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleHtmlUpdate = (html: any) => {
    if (typeof html === 'object' && html.home) {
      setGeneratedCode(html.home);
    } else if (typeof html === 'string') {
      setGeneratedCode(html);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Top Bar with Actions */}
      <ActionBar 
        projectName={projectName}
        onRefresh={() => {
          // Refresh logic
          toast.info('Refreshing preview...');
        }}
        onPublish={() => {
          toast.success('Project published successfully!');
        }}
        onRename={() => {
          toast.info('Rename functionality not implemented yet');
        }}
        onDelete={() => {
          toast.info('Delete functionality not implemented yet');
        }}
        onFavorite={() => {
          toast.success('Added to favorites!');
        }}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Version Control */}
        <VersionSidebar />
        
        {/* Main Content Panel */}
        <div className="flex-1 flex">
          {/* Left Panel - AI Prompt */}
          <div className="w-1/4 border-r border-border overflow-y-auto">
            <AIPromptPanel 
              onHtmlUpdate={handleHtmlUpdate}
              isGenerating={isGenerating}
            />
          </div>
          
          {/* Right Panel - Preview */}
          <div className="w-3/4 overflow-hidden">
            <PreviewPanel generatedCode={generatedCode} />
          </div>
        </div>
        
        {/* Right Sidebar - User Profile */}
        <UserSidebar 
          userName={userName}
          userEmail={userEmail}
          userAvatarUrl={userAvatarUrl}
        />
      </div>
    </div>
  );
};

export default V0Dashboard;
