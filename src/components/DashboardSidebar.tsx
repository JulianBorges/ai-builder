
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  History, 
  Code, 
  Github, 
  Layout, 
  Settings, 
  ArrowLeft
} from 'lucide-react';

interface DashboardSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

const DashboardSidebar = ({
  isCollapsed,
  onToggle,
  activeTab,
  onChangeTab
}: DashboardSidebarProps) => {
  const tabs = [
    { id: 'editor', label: 'Editor', icon: Layout },
    { id: 'code', label: 'Code', icon: Code },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`bg-card border-r border-border transition-all duration-300 flex flex-col h-full ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="p-3 border-b border-border flex items-center justify-between">
        {!isCollapsed && <span className="font-medium">Project Editor</span>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle}
          className={`${isCollapsed ? 'mx-auto' : ''}`}
        >
          <ArrowLeft className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
        </Button>
      </div>
      
      <nav className="p-2 space-y-1 flex-grow">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "secondary" : "ghost"}
            className={`w-full justify-start ${activeTab === tab.id ? 'bg-secondary text-foreground' : ''}`}
            onClick={() => onChangeTab(tab.id)}
          >
            <tab.icon className={`h-4 w-4 ${!isCollapsed ? 'mr-2' : 'mx-auto'}`} />
            {!isCollapsed && <span>{tab.label}</span>}
          </Button>
        ))}
      </nav>
      
      <div className="p-2 border-t border-border mt-auto">
        <Button 
          variant="outline" 
          className={`w-full border-primary/30 hover:border-primary ${isCollapsed ? 'p-2' : ''}`}
        >
          <Github className={`h-4 w-4 ${!isCollapsed ? 'mr-2' : 'mx-auto'}`} />
          {!isCollapsed && <span>Push to GitHub</span>}
        </Button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
