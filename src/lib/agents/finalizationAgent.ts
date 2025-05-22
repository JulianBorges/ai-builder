
import { 
  AgentContext, 
  GenerationPlan, 
  AgentOutputs, 
  FinalizationInput, 
  FinalizationResult,
  OrchestrationResult
} from "./types";

/**
 * Finalization Agent
 * 
 * Takes outputs from all previous agents and finalizes them into:
 * 1. A complete HTML document for preview
 * 2. A collection of files that make up the project
 *
 * @param input Combined outputs from previous agents
 * @param context Original agent context
 * @returns Complete HTML and file structure
 */
export const finalizationAgent = async (
  input: FinalizationInput | OrchestrationResult,
  context: AgentContext
): Promise<FinalizationResult> => {
  try {
    // Extract plan and outputs
    const plan = input.plan;
    const agentOutputs = 'agentOutputs' in input ? input.agentOutputs : {};
    
    // Initialize result structure
    const result: FinalizationResult = {
      html_code: '',
      files: [],
      agent_outputs: 'agentOutputs' in input ? input.agentOutputs : undefined
    };
    
    // Generate HTML for preview (using the first page, typically home)
    const homePage = plan.pages.find(p => p.name === 'home') || plan.pages[0];
    
    // Use existing HTML if it exists in the input, otherwise generate it
    if ('html' in input && input.html && input.html[homePage.name]) {
      result.html_code = input.html[homePage.name];
    } else {
      result.html_code = generateHtmlPreview(plan, homePage, 
        'css' in input ? input.css : '', 
        'javascript' in input ? input.javascript : '');
    }
    
    // Generate file structure for the project
    result.files = [
      ...generatePageFiles(plan),
      ...generateComponentFiles(plan),
      ...generateStyleFiles(plan),
      ...generateUtilityFiles(plan)
    ];
    
    // For any files that exist in input.files, use those instead
    if ('files' in input && input.files) {
      const existingFilePaths = new Set(input.files.map(f => f.path));
      
      // Filter out files that already exist in input.files
      result.files = result.files.filter(file => !existingFilePaths.has(file.path));
      
      // Add files from input.files
      result.files.push(...input.files);
    }
    
    return result;
  } catch (error) {
    console.error("Finalization Agent Error:", error);
    
    // Return a basic fallback in case of error
    return {
      html_code: generateFallbackHtml(error instanceof Error ? error.message : String(error)),
      files: [{
        path: "pages/index.tsx",
        content: `export default function Home() {\n  return <div>An error occurred during generation</div>;\n}`
      }]
    };
  }
};

/**
 * Generates a complete HTML document for preview from the plan and agent outputs
 */
function generateHtmlPreview(
  plan: GenerationPlan,
  page: any,
  css: string = '',
  javascript: string = ''
): string {
  // Extract site configuration
  const { siteConfig } = plan;
  
  // Use custom CSS or generate default styles
  const styles = css || generateDefaultStyles(siteConfig);
  
  // Use custom JS or generate default interactions
  const js = javascript || generateDefaultJavaScript();
  
  // Generate navigation from pages
  const navigation = plan.pages.map(p => `
    <li><a href="${p.path.replace('pages/', '').replace('.tsx', '.html')}" 
      class="${p.name === page.name ? 'active' : ''}">${p.name}</a></li>
  `).join('');
  
  // Generate sections for the current page
  const sections = page.sections.map(section => `
    <section id="${section.id}" class="section section-${section.type}">
      <div class="container">
        <h2 class="section-title">${capitalizeFirstLetter(section.id)}</h2>
        ${generatePlaceholderContent(section)}
      </div>
    </section>
  `).join('');
  
  // Construct final HTML document
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.meta.title}</title>
  <meta name="description" content="${page.meta.description}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${siteConfig.typography.headingFont.split(',')[0].replace(/ /g, '+')}:wght@400;600;700&family=${siteConfig.typography.bodyFont.split(',')[0].replace(/ /g, '+')}:wght@400;500&display=swap" rel="stylesheet">
  <style>
    ${styles}
  </style>
</head>
<body>
  <header class="site-header">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <h1>${siteConfig.name}</h1>
        </div>
        <nav class="main-nav">
          <div class="mobile-menu-toggle">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <ul class="nav-list">
            ${navigation}
          </ul>
        </nav>
      </div>
    </div>
  </header>

  <main>
    ${sections}
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-info">
          <h2>${siteConfig.name}</h2>
          <p>${siteConfig.description}</p>
        </div>
        <div class="footer-nav">
          <h3>Navigation</h3>
          <ul>
            ${navigation}
          </ul>
        </div>
        <div class="footer-contact">
          <h3>Contact</h3>
          <p>Email: info@example.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script>
    ${js}
  </script>
</body>
</html>`;
}

/**
 * Generates placeholder content based on section type
 */
function generatePlaceholderContent(section: any): string {
  switch (section.type) {
    case 'hero':
      return `
        <div class="hero-content">
          <h1 class="hero-title">Welcome to Our Website</h1>
          <p class="hero-subtitle">We provide amazing products and services</p>
          <div class="hero-cta">
            <button class="btn btn-primary">Get Started</button>
            <button class="btn btn-secondary">Learn More</button>
          </div>
        </div>
        <div class="hero-image">
          <div class="placeholder-image"></div>
        </div>
      `;
    
    case 'features':
    case 'grid':
      return `
        <div class="grid-container">
          <div class="grid-item">
            <div class="icon">✨</div>
            <h3>Feature One</h3>
            <p>Description of this amazing feature and why it's useful.</p>
          </div>
          <div class="grid-item">
            <div class="icon">🚀</div>
            <h3>Feature Two</h3>
            <p>Description of another impressive feature we provide.</p>
          </div>
          <div class="grid-item">
            <div class="icon">🛠️</div>
            <h3>Feature Three</h3>
            <p>Yet another great feature that sets us apart from competitors.</p>
          </div>
        </div>
      `;
    
    case 'testimonials':
    case 'carousel':
      return `
        <div class="carousel">
          <div class="carousel-item active">
            <blockquote>
              <p>"This service exceeded all my expectations. Highly recommended!"</p>
              <cite>— Jane Doe, Company Inc.</cite>
            </blockquote>
          </div>
          <div class="carousel-controls">
            <button class="carousel-prev">Previous</button>
            <button class="carousel-next">Next</button>
          </div>
        </div>
      `;
    
    case 'contact':
    case 'form':
      return `
        <div class="form-container">
          <form class="contact-form">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" placeholder="Your Name" />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" placeholder="Your Email" />
            </div>
            <div class="form-group">
              <label for="message">Message</label>
              <textarea id="message" placeholder="Your Message"></textarea>
            </div>
            <div class="form-submit">
              <button type="submit" class="btn btn-primary">Send Message</button>
            </div>
          </form>
        </div>
      `;
    
    case 'about':
    case 'content':
      return `
        <div class="content-wrapper">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Phasellus 
             fermentum tincidunt nisl, vitae finibus dolor ultricies ac. Sed consectetur diam at 
             rhoncus faucibus. Curabitur sed erat mollis, condimentum ipsum sit amet, cursus enim.</p>
          
          <p>Vivamus lacinia justo et mi hendrerit, eu posuere lorem tincidunt. Proin eu risus 
             blandit, pharetra justo eu, pharetra magna. Vivamus tempus nunc eu bibendum congue.</p>
        </div>
      `;
    
    default:
      return `
        <div class="default-content">
          <p>Content for ${section.id} section</p>
        </div>
      `;
  }
}

/**
 * Generates default CSS styles based on site config
 */
function generateDefaultStyles(config: any): string {
  return `
    :root {
      --primary-color: ${config.primaryColor};
      --secondary-color: ${config.secondaryColor};
      --heading-font: ${config.typography.headingFont};
      --body-font: ${config.typography.bodyFont};
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      height: 100%;
    }

    body {
      font-family: var(--body-font);
      line-height: 1.6;
      color: #333;
      font-size: 16px;
    }

    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: var(--heading-font);
      margin-bottom: 1rem;
      line-height: 1.3;
    }

    p {
      margin-bottom: 1rem;
    }

    a {
      color: var(--primary-color);
      text-decoration: none;
      transition: color 0.3s ease;
    }

    a:hover {
      color: var(--secondary-color);
    }

    ul {
      list-style: none;
    }

    img {
      max-width: 100%;
      height: auto;
    }

    .btn {
      display: inline-block;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s, transform 0.2s;
    }

    .btn:hover {
      transform: translateY(-2px);
    }

    .btn-primary {
      background-color: var(--primary-color);
      color: white;
    }

    .btn-secondary {
      background-color: var(--secondary-color);
      color: white;
    }

    .site-header {
      padding: 1rem 0;
      background-color: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo h1 {
      font-size: 1.5rem;
      margin: 0;
    }

    .main-nav .nav-list {
      display: flex;
      gap: 1.5rem;
    }

    .main-nav .nav-list a {
      color: #333;
      font-weight: 500;
    }

    .main-nav .nav-list a.active {
      color: var(--primary-color);
    }

    .mobile-menu-toggle {
      display: none;
      flex-direction: column;
      gap: 5px;
      cursor: pointer;
    }

    .mobile-menu-toggle span {
      width: 25px;
      height: 3px;
      background-color: #333;
      transition: all 0.3s;
    }

    section {
      padding: 4rem 0;
    }

    .section-title {
      text-align: center;
      margin-bottom: 2rem;
    }

    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }

    .grid-item {
      padding: 1.5rem;
      background-color: #f9f9f9;
      border-radius: 8px;
      text-align: center;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .grid-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    .grid-item .icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .hero-content {
      max-width: 600px;
      margin-bottom: 2rem;
    }

    .hero-title {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .hero-cta {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .placeholder-image {
      width: 100%;
      height: 300px;
      background-color: #eee;
      border-radius: 8px;
    }

    .form-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: var(--body-font);
    }

    .form-group textarea {
      min-height: 150px;
    }

    .form-submit {
      text-align: center;
    }

    .carousel {
      max-width: 800px;
      margin: 0 auto;
      position: relative;
    }

    .carousel-item {
      padding: 2rem;
      text-align: center;
    }

    .carousel-item blockquote {
      font-size: 1.2rem;
      font-style: italic;
      margin-bottom: 1rem;
    }

    .carousel-controls {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 1rem;
    }

    .site-footer {
      background-color: #f5f5f5;
      padding: 4rem 0 2rem;
      margin-top: 4rem;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .footer-nav ul {
      margin-top: 1rem;
    }

    .footer-nav ul li {
      margin-bottom: 0.5rem;
    }

    .footer-bottom {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid #ddd;
    }

    /* Media Queries for Responsiveness */
    @media (max-width: 768px) {
      .mobile-menu-toggle {
        display: flex;
      }

      .main-nav .nav-list {
        display: none;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        padding: 1rem;
        box-shadow: 0 5px 10px rgba(0,0,0,0.1);
      }

      .main-nav.active .nav-list {
        display: flex;
      }

      .hero-content {
        text-align: center;
      }

      .hero-cta {
        justify-content: center;
      }

      .carousel-item blockquote {
        font-size: 1rem;
      }
    }
  `;
}

/**
 * Generates default JavaScript for interactivity
 */
function generateDefaultJavaScript(): string {
  return `
    document.addEventListener('DOMContentLoaded', function() {
      // Mobile menu toggle
      const menuToggle = document.querySelector('.mobile-menu-toggle');
      const mainNav = document.querySelector('.main-nav');
      
      if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
          mainNav.classList.toggle('active');
        });
      }
      
      // Simple carousel functionality
      const carousel = document.querySelector('.carousel');
      if (carousel) {
        const items = carousel.querySelectorAll('.carousel-item');
        const nextBtn = carousel.querySelector('.carousel-next');
        const prevBtn = carousel.querySelector('.carousel-prev');
        
        let currentIndex = 0;
        
        function showSlide(index) {
          items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
          });
        }
        
        if (nextBtn) {
          nextBtn.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % items.length;
            showSlide(currentIndex);
          });
        }
        
        if (prevBtn) {
          prevBtn.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            showSlide(currentIndex);
          });
        }
      }
      
      // Form validation
      const form = document.querySelector('.contact-form');
      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          
          let valid = true;
          const nameInput = form.querySelector('#name');
          const emailInput = form.querySelector('#email');
          
          if (nameInput && nameInput.value.trim() === '') {
            valid = false;
            // Show error
          }
          
          if (emailInput && (!emailInput.value.includes('@') || !emailInput.value.includes('.'))) {
            valid = false;
            // Show error
          }
          
          if (valid) {
            // Submit form or show success message
            alert('Form submitted successfully!');
          }
        });
      }
    });
  `;
}

/**
 * Generates React page files based on the plan
 */
function generatePageFiles(plan: GenerationPlan): Array<{ path: string, content: string }> {
  return plan.pages.map(page => {
    const importStatements = page.components.map(
      comp => `import ${comp.replace('.tsx', '')} from '../components/${comp.replace('.tsx', '')}';`
    ).join('\n');
    
    // Generate sections JSX
    const sectionsJsx = page.sections.map(section => {
      switch (section.type) {
        case 'hero':
          return `
      <section id="${section.id}" className="section-${section.type}">
        <div className="container">
          <h1>Welcome to ${plan.siteConfig.name}</h1>
          <p>Your premier destination for ${plan.siteConfig.description}</p>
          <div className="cta-buttons">
            <button className="btn-primary">Get Started</button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
      </section>`;
        
        case 'features':
        case 'grid':
          return `
      <section id="${section.id}" className="section-${section.type}">
        <div className="container">
          <h2>${capitalizeFirstLetter(section.id)}</h2>
          <div className="grid">
            <div className="grid-item">
              <h3>Feature 1</h3>
              <p>Description of this amazing feature</p>
            </div>
            <div className="grid-item">
              <h3>Feature 2</h3>
              <p>Description of another feature</p>
            </div>
            <div className="grid-item">
              <h3>Feature 3</h3>
              <p>Description of a third feature</p>
            </div>
          </div>
        </div>
      </section>`;
        
        default:
          return `
      <section id="${section.id}" className="section-${section.type}">
        <div className="container">
          <h2>${capitalizeFirstLetter(section.id)}</h2>
          <p>Content for the ${section.id} section</p>
        </div>
      </section>`;
      }
    }).join('\n');
    
    // Generate page component
    return {
      path: page.path,
      content: `import React from 'react';
${importStatements}
import Head from 'next/head';
${page.components.includes('Header') ? '' : 'import Header from "../components/Header";'}
${page.components.includes('Footer') ? '' : 'import Footer from "../components/Footer";'}

export default function ${capitalizeFirstLetter(page.name)}Page() {
  return (
    <>
      <Head>
        <title>${page.meta.title}</title>
        <meta name="description" content="${page.meta.description}" />
      </Head>
      
      <Header />
      
      <main>
${sectionsJsx}
      </main>
      
      <Footer />
    </>
  );
}
`
    };
  });
}

/**
 * Generates component files based on the plan
 */
function generateComponentFiles(plan: GenerationPlan): Array<{ path: string, content: string }> {
  return plan.components.map(component => {
    let componentContent = '';
    
    switch (component.name) {
      case 'Header':
        componentContent = `import React from 'react';
import Link from 'next/link';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  return (
    <header className="site-header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link href="/">
              <a><h1>Site Name</h1></a>
            </Link>
          </div>
          
          <nav className={\`main-nav \${mobileMenuOpen ? 'active' : ''}\`}>
            <div className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <ul className="nav-list">
              ${plan.pages.map(p => `<li><Link href="/${p.name === 'home' ? '' : p.name}"><a>${capitalizeFirstLetter(p.name)}</a></Link></li>`).join('\n              ')}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}`;
        break;
      
      case 'Footer':
        componentContent = `import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <h2>Site Name</h2>
            <p>A brief description of the site and its mission.</p>
          </div>
          
          <div className="footer-nav">
            <h3>Navigation</h3>
            <ul>
              ${plan.pages.map(p => `<li><Link href="/${p.name === 'home' ? '' : p.name}"><a>${capitalizeFirstLetter(p.name)}</a></Link></li>`).join('\n              ')}
            </ul>
          </div>
          
          <div className="footer-contact">
            <h3>Contact</h3>
            <p>Email: info@example.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} Site Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}`;
        break;
        
      case 'Button':
        componentContent = `import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '' 
}: ButtonProps) {
  return (
    <button 
      className={\`btn btn-\${variant} \${className}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}`;
        break;
        
      case 'Hero':
        componentContent = `import React from 'react';
import Button from './Button';

interface HeroProps {
  title: string;
  subtitle: string;
  primaryCta?: string;
  secondaryCta?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export default function Hero({
  title,
  subtitle,
  primaryCta = 'Get Started',
  secondaryCta = 'Learn More',
  onPrimaryClick,
  onSecondaryClick
}: HeroProps) {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">{title}</h1>
          <p className="hero-subtitle">{subtitle}</p>
          
          <div className="hero-cta">
            <Button variant="primary" onClick={onPrimaryClick}>
              {primaryCta}
            </Button>
            
            <Button variant="secondary" onClick={onSecondaryClick}>
              {secondaryCta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}`;
        break;
        
      default:
        componentContent = `import React from 'react';

interface ${component.name}Props {
  // Define props here
}

export default function ${component.name}({}: ${component.name}Props) {
  return (
    <div className="${component.name.toLowerCase()}">
      ${component.name} Component
    </div>
  );
}`;
    }
    
    return {
      path: component.path,
      content: componentContent
    };
  });
}

/**
 * Generates style files based on the plan
 */
function generateStyleFiles(plan: GenerationPlan): Array<{ path: string, content: string }> {
  return plan.styles.map(style => {
    let styleContent = '';
    
    if (style.name === 'globals') {
      styleContent = `/* Global styles */

:root {
  --primary-color: ${plan.siteConfig.primaryColor};
  --secondary-color: ${plan.siteConfig.secondaryColor};
  --heading-font: ${plan.siteConfig.typography.headingFont};
  --body-font: ${plan.siteConfig.typography.bodyFont};
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  font-family: var(--body-font);
}

body {
  line-height: 1.6;
  color: #333;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--heading-font);
  margin-bottom: 1rem;
  line-height: 1.3;
}

a {
  color: inherit;
  text-decoration: none;
}

/* Layout */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: white;
}

/* Header */
.site-header {
  padding: 1rem 0;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-list {
  display: flex;
  list-style: none;
  gap: 2rem;
}

/* Sections */
section {
  padding: 4rem 0;
}

/* Responsive */
@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: flex;
    flex-direction: column;
    gap: 4px;
    cursor: pointer;
  }
  
  .mobile-menu-toggle span {
    display: block;
    width: 25px;
    height: 3px;
    background-color: #333;
    transition: all 0.3s;
  }
  
  .main-nav .nav-list {
    display: none;
  }
  
  .main-nav.active .nav-list {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    padding: 1rem;
    box-shadow: 0 5px 10px rgba(0,0,0,0.1);
  }
}`;
    } else if (style.name === 'variables') {
      styleContent = `/* CSS Variables */

:root {
  /* Colors */
  --primary-color: ${plan.siteConfig.primaryColor};
  --secondary-color: ${plan.siteConfig.secondaryColor};
  --text-color: #333333;
  --bg-color: #ffffff;
  --light-gray: #f5f5f5;
  --medium-gray: #cccccc;
  --dark-gray: #666666;
  
  /* Typography */
  --heading-font: ${plan.siteConfig.typography.headingFont};
  --body-font: ${plan.siteConfig.typography.bodyFont};
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --spacing-xl: 4rem;
  
  /* Border Radius */
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 1rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  
  /* Transitions */
  --transition-fast: 0.2s;
  --transition-normal: 0.3s;
  --transition-slow: 0.5s;
}`;
    } else {
      // For other style files
      styleContent = `/* Styles for ${style.name} */

/* Add custom styles here */`;
    }
    
    return {
      path: style.path,
      content: styleContent
    };
  });
}

/**
 * Generates additional utility files for the project
 */
function generateUtilityFiles(plan: GenerationPlan): Array<{ path: string, content: string }> {
  return [
    {
      path: 'lib/utils.ts',
      content: `/**
 * Utility functions for the website
 */

/**
 * Combine class names with conditional logic
 */
export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format a date using Intl.DateTimeFormat
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return new Intl.DateTimeFormat('en-US', options || defaultOptions).format(d);
}
`
    }
  ];
}

/**
 * Generates fallback HTML in case of error
 */
function generateFallbackHtml(errorMessage: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error in Website Generation</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      line-height: 1.5;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
      color: #333;
    }
    .error-container {
      background-color: #fff3f3;
      border-left: 4px solid #ff5757;
      padding: 1rem 1.5rem;
      border-radius: 0 4px 4px 0;
      margin: 2rem 0;
    }
    .error-message {
      color: #d32f2f;
      font-family: monospace;
      white-space: pre-wrap;
    }
    h1 {
      border-bottom: 1px solid #eee;
      padding-bottom: 0.5rem;
    }
  </style>
</head>
<body>
  <h1>Website Generation Error</h1>
  <p>An error occurred while generating your website. Please check the error message below:</p>
  
  <div class="error-container">
    <p class="error-message">${errorMessage}</p>
  </div>
  
  <p>Please try again with a different prompt or check if your input is valid.</p>
</body>
</html>`;
}

/**
 * Helper function to capitalize the first letter of a string
 */
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
