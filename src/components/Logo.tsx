
import { Code } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center">
        <Code className="h-5 w-5 text-white" />
      </div>
      <span className="font-bold text-xl">BuildAI</span>
    </div>
  );
};

export default Logo;
