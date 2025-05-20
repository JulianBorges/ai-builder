
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  isSuggestion?: boolean;
  lastUpdated?: string;
}

const ProjectCard = ({
  title,
  description,
  image,
  isSuggestion = false,
  lastUpdated,
}: ProjectCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 glass-card glow-effect">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
        {isSuggestion && (
          <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs font-medium">
            Suggestion
          </div>
        )}
      </div>
      
      <CardContent className="pt-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
        {lastUpdated && (
          <p className="text-xs text-muted-foreground mt-2">
            Last updated: {lastUpdated}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <Link to={isSuggestion ? "/" : "/dashboard"} className="w-full">
          <Button 
            variant="outline" 
            className="w-full border-primary/30 hover:border-primary"
          >
            {isSuggestion ? 'Use Template' : 'Edit Project'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
