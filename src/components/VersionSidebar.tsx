import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface Version {
  id: string;
  label: string;
  date: string;
  slug: string;
}

interface VersionSidebarProps {
  versions?: Version[];
  onSelect: (version: Version) => void;
  onClose: () => void;
  isOpen: boolean;
}

const VersionSidebar: React.FC<VersionSidebarProps> = ({
  versions = [],
  onSelect,
  onClose,
  isOpen,
}) => {
  const [localVersions, setLocalVersions] = useState<Version[]>([]);

  useEffect(() => {
    if (versions.length > 0) {
      setLocalVersions(versions);
    } else {
      const stored = localStorage.getItem('saved_versions');
      if (stored) {
        setLocalVersions(JSON.parse(stored));
      }
    }
  }, [versions]);

  if (!isOpen) return null;

  return (
    <aside className="fixed top-0 right-0 h-full w-96 bg-white dark:bg-zinc-900 border-l border-border shadow-lg z-50 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Versões</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>Fechar</Button>
      </div>
      <ul className="space-y-3">
        {localVersions.map((version) => (
          <li key={version.id} className="border-b pb-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{version.label}</p>
                <p className="text-xs text-muted-foreground">{version.date}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => onSelect(version)}>Carregar</Button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default VersionSidebar;
