
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogPost = () => {
  const { id } = useParams();
  
  // In a real app, you would fetch the blog post based on the id
  // This is a mock blog post for demonstration
  const blogPost = {
    id: id,
    title: 'Getting Started with AI Website Generation',
    content: `
      <p>Artificial Intelligence is revolutionizing the way we build websites. With the right tools and approach, you can create stunning, functional websites in a fraction of the time it would take using traditional methods.</p>
      
      <h2>Understanding AI Website Generation</h2>
      <p>AI website generation combines natural language processing, computer vision, and machine learning to interpret your requirements and transform them into working code. The technology analyzes thousands of design patterns and best practices to create websites that not only look professional but also follow modern development standards.</p>
      
      <h2>Key Benefits of AI-Generated Websites</h2>
      <ul>
        <li><strong>Speed:</strong> Create a complete website in minutes instead of days or weeks.</li>
        <li><strong>Cost-effectiveness:</strong> Reduce development costs significantly.</li>
        <li><strong>Accessibility:</strong> No coding knowledge required to get started.</li>
        <li><strong>Customizability:</strong> Easily modify generated code to suit specific needs.</li>
      </ul>
      
      <h2>Getting Started: Your First AI-Generated Website</h2>
      <p>Follow these simple steps to create your first AI-generated website:</p>
      
      <h3>1. Define Your Requirements</h3>
      <p>Start by clearly defining what kind of website you need. Be specific about functionality, design preferences, and any special features you require.</p>
      
      <h3>2. Craft an Effective Prompt</h3>
      <p>The quality of your AI-generated website depends significantly on your prompt. Include details about:</p>
      <ul>
        <li>Website type (e-commerce, portfolio, blog, etc.)</li>
        <li>Target audience</li>
        <li>Design preferences (colors, style, theme)</li>
        <li>Key functionalities</li>
        <li>Content sections</li>
      </ul>
      
      <h3>3. Review and Refine</h3>
      <p>Once your website is generated, review it carefully. You can then provide additional prompts to refine specific aspects of the design or functionality.</p>
      
      <h3>4. Customize and Deploy</h3>
      <p>Make any final adjustments to the generated code, add your content, and deploy your website.</p>
      
      <h2>Best Practices for AI Website Generation</h2>
      <p>To get the most out of AI website generation tools:</p>
      <ul>
        <li>Use clear, detailed prompts</li>
        <li>Break complex websites into smaller components</li>
        <li>Iterate gradually rather than trying to get everything perfect in one go</li>
        <li>Learn basic HTML/CSS for easier customization</li>
      </ul>
      
      <h2>The Future of Web Development</h2>
      <p>As AI continues to evolve, we can expect even more sophisticated website generation capabilities. The line between AI-generated and human-coded websites will continue to blur, making professional web development accessible to everyone.</p>
    `,
    date: 'May 15, 2025',
    readTime: '8',
    author: 'Sarah Johnson',
    authorRole: 'Head of Product',
    authorImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=256&h=256&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    category: 'Tutorials',
    tags: ['AI', 'Website Generation', 'Beginners', 'Tutorial']
  };

  return (
    <div className="pt-20 pb-16">
      <div className="container max-w-4xl py-10">
        {/* Back Button */}
        <Link to="/blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
        
        {/* Blog Header */}
        <div className="mb-8">
          <span className="text-primary text-sm font-medium">{blogPost.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4">{blogPost.title}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="rounded-full overflow-hidden w-10 h-10">
              <img 
                src={blogPost.authorImage} 
                alt={blogPost.author}
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <p className="font-medium">{blogPost.author}</p>
              <p className="text-sm text-muted-foreground">
                {blogPost.authorRole} · {blogPost.date} · {blogPost.readTime} min read
              </p>
            </div>
          </div>
        </div>
        
        {/* Featured Image */}
        <div className="rounded-lg overflow-hidden mb-10 glass-card p-1">
          <img 
            src={blogPost.coverImage} 
            alt={blogPost.title}
            className="w-full h-auto rounded-lg" 
          />
        </div>
        
        {/* Blog Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
        </div>
        
        {/* Tags */}
        <div className="my-10 flex flex-wrap gap-2">
          {blogPost.tags.map(tag => (
            <span 
              key={tag}
              className="px-3 py-1 bg-secondary/50 text-foreground rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Author Box */}
        <div className="glass-card p-6 rounded-xl flex flex-col md:flex-row items-center gap-6 my-10">
          <div className="rounded-full overflow-hidden w-20 h-20 flex-shrink-0">
            <img 
              src={blogPost.authorImage} 
              alt={blogPost.author}
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg">About {blogPost.author}</h3>
            <p className="text-sm text-muted-foreground mb-3">{blogPost.authorRole}</p>
            <p>
              Sarah is a product leader with over 10 years of experience in web development 
              and AI technologies. She's passionate about making advanced tech accessible to everyone.
            </p>
          </div>
        </div>
        
        {/* Related Posts - Placeholder */}
        <div className="my-10">
          <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
          <p className="text-muted-foreground">Related articles would be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
