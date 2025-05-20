
import { useState } from 'react';
import BlogPostCard from '@/components/BlogPostCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const blogPosts = [
    {
      id: '1',
      title: 'Getting Started with AI Website Generation',
      excerpt: 'Learn how to create your first AI-generated website with our step-by-step guide for beginners.',
      date: 'May 15, 2025',
      readTime: '8',
      coverImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      category: 'Tutorials'
    },
    {
      id: '2',
      title: 'The Future of Web Development: AI and No-Code Tools',
      excerpt: 'Explore how artificial intelligence and no-code platforms are transforming the web development landscape.',
      date: 'May 10, 2025',
      readTime: '6',
      coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
      category: 'Industry Trends'
    },
    {
      id: '3',
      title: 'How to Optimize Your AI-Generated Website for SEO',
      excerpt: 'Discover essential SEO strategies to ensure your AI-built website ranks well on search engines.',
      date: 'May 5, 2025',
      readTime: '10',
      coverImage: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
      category: 'SEO'
    },
    {
      id: '4',
      title: 'Custom Components: Extending Your AI Website Builder',
      excerpt: 'Learn how to create and integrate custom components to enhance your AI-generated websites.',
      date: 'April 28, 2025',
      readTime: '12',
      coverImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
      category: 'Advanced'
    },
    {
      id: '5',
      title: 'From Concept to Launch: A Success Story',
      excerpt: 'Read how one entrepreneur went from idea to successful online business using AI website generation.',
      date: 'April 20, 2025',
      readTime: '5',
      coverImage: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
      category: 'Case Studies'
    },
    {
      id: '6',
      title: '10 Design Principles for Better AI-Generated Websites',
      excerpt: 'Essential design principles to guide your AI prompts for more visually appealing and user-friendly websites.',
      date: 'April 15, 2025',
      readTime: '7',
      coverImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
      category: 'Design'
    }
  ];
  
  // Simple filtering functionality based on title and excerpt
  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-20 pb-16">
      <div className="container py-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Blog & Resources</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tips, tutorials, and insights on AI website generation and modern web development
          </p>
        </div>
        
        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Featured Post */}
        <div className="mb-12">
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-full">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
                  alt="Featured Post" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <span className="text-primary text-sm font-medium mb-2">Featured Article</span>
                <h2 className="text-2xl font-bold mb-4">
                  The Complete Guide to AI Website Generation in 2025
                </h2>
                <p className="text-muted-foreground mb-6">
                  Everything you need to know about leveraging AI for website creation, 
                  from basic concepts to advanced techniques that will set your projects apart.
                </p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-sm text-muted-foreground">May 20, 2025 · 15 min read</span>
                  <Button variant="outline" className="border-primary/30 hover:border-primary">
                    Read Article
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <BlogPostCard key={post.id} {...post} />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No articles found matching your search.</p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </Button>
            </div>
          )}
        </div>
        
        {/* Newsletter */}
        <div className="mt-16 glass-card p-8 rounded-xl text-center">
          <h3 className="text-2xl font-bold mb-3">Subscribe to our newsletter</h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Get the latest articles, tutorials, and updates delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
