
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BlogPostCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  coverImage: string;
  category: string;
}

const BlogPostCard = ({
  id,
  title,
  excerpt,
  date,
  readTime,
  coverImage,
  category,
}: BlogPostCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 glass-card glow-effect">
      <Link to={`/blog/${id}`} className="block h-48 overflow-hidden">
        <img 
          src={coverImage} 
          alt={title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
      </Link>
      
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="border-primary/40 text-primary">
            {category}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            {date} · {readTime} min read
          </div>
        </div>
        
        <Link to={`/blog/${id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm line-clamp-3">
          {excerpt}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Link to={`/blog/${id}`} className="text-sm text-primary hover:underline">
          Read more
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BlogPostCard;
