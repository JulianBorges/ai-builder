
import React, { useState } from 'react';
import { Separator } from "@/components/ui/separator";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileItem {
  name: string;
  path: string;
  status?: "Generated" | "Modified" | "New";
}

interface VersionProps {
  number: number;
  files: FileItem[];
  isActive?: boolean;
}

export const VersionItem = ({ 
  number, 
  files, 
  isActive = false 
}: VersionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <div className="flex items-center justify-between py-2 px-2 text-sm">
        <CollapsibleTrigger className="flex items-center gap-1 hover:text-foreground/70 transition-colors group">
          {isOpen ? 
            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground/70 transition-colors" /> : 
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground/70 transition-colors" />
          }
          <span className="font-medium">Version {number}</span>
        </CollapsibleTrigger>
        <div className="flex gap-2">
          <span className="text-xs text-muted-foreground">{isActive ? "Latest" : ""}</span>
          <span className="text-xs bg-secondary text-secondary-foreground rounded px-1.5">Viewing</span>
        </div>
      </div>
      
      <CollapsibleContent>
        <div className="pl-6 space-y-1">
          {files.map((file, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between py-1 px-2 hover:bg-secondary/50 rounded-md text-sm cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-muted-foreground" />
                <span>{file.name}</span>
              </div>
              {file.status && (
                <span className="text-xs text-muted-foreground">{file.status}</span>
              )}
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const VersionSidebar = () => {
  // This would come from your data source in a real app
  const versions = [
    {
      number: 1,
      isActive: true,
      files: [
        { name: "app/page.tsx", path: "/app/page.tsx", status: "Generated" as const },
        { name: "app/layout.tsx", path: "/app/layout.tsx", status: "Generated" as const },
      ]
    },
    // You can add more versions here
  ];

  return (
    <div className="w-56 border-r border-border h-full overflow-y-auto">
      <div className="p-2">
        {versions.map((version, index) => (
          <VersionItem 
            key={index} 
            number={version.number} 
            files={version.files} 
            isActive={version.isActive} 
          />
        ))}
      </div>
    </div>
  );
};

export default VersionSidebar;
