import GlassPanel from "./GlassPanel";
import { Link } from "wouter";

export default function Footer() {
  const scrollToFeatures = () => {
    const element = document.querySelector('[data-testid="features-section"]');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener noreferrer');
  };

  return (
    <footer className="px-6 py-12" data-testid="footer">
      <div className="max-w-6xl mx-auto">
        <GlassPanel className="p-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center space-x-3 mb-4 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <i className="fas fa-robot text-black text-lg" data-testid="footer-logo-icon"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary" data-testid="footer-brand-name">SmartFlow AI</h3>
                  <p className="text-xs text-muted-foreground" data-testid="footer-brand-tagline">AI-Powered Content Generation</p>
                </div>
              </Link>
              <p className="text-muted-foreground mb-4" data-testid="footer-description">
                Transform your creative process with AI-powered content generation. 
                Create stunning text and images in seconds.
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => openExternalLink('https://twitter.com/smartflowai')}
                  className="w-10 h-10 border border-primary/30 rounded-full flex items-center justify-center hover:bg-primary hover:text-black transition-colors" 
                  data-testid="social-twitter"
                  title="Follow us on Twitter"
                >
                  <i className="fab fa-twitter"></i>
                </button>
                <button 
                  onClick={() => openExternalLink('https://linkedin.com/company/smartflowai')}
                  className="w-10 h-10 border border-primary/30 rounded-full flex items-center justify-center hover:bg-primary hover:text-black transition-colors" 
                  data-testid="social-linkedin"
                  title="Connect with us on LinkedIn"
                >
                  <i className="fab fa-linkedin"></i>
                </button>
                <button 
                  onClick={() => openExternalLink('https://github.com/smartflowai')}
                  className="w-10 h-10 border border-primary/30 rounded-full flex items-center justify-center hover:bg-primary hover:text-black transition-colors" 
                  data-testid="social-github"
                  title="View our GitHub"
                >
                  <i className="fab fa-github"></i>
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" data-testid="footer-product-title">Product</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={scrollToFeatures}
                    className="text-muted-foreground hover:text-primary transition-colors text-left"
                    data-testid="footer-link-features"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <Link 
                    href="/account" 
                    className="text-muted-foreground hover:text-primary transition-colors" 
                    data-testid="footer-link-pricing"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => openExternalLink('https://docs.smartflowai.com/api')}
                    className="text-muted-foreground hover:text-primary transition-colors text-left"
                    data-testid="footer-link-api"
                  >
                    API
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openExternalLink('https://docs.smartflowai.com')}
                    className="text-muted-foreground hover:text-primary transition-colors text-left"
                    data-testid="footer-link-docs"
                  >
                    Documentation
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" data-testid="footer-support-title">Support</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => openExternalLink('https://help.smartflowai.com')}
                    className="text-muted-foreground hover:text-primary transition-colors text-left"
                    data-testid="footer-link-help"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openExternalLink('mailto:support@smartflowai.com')}
                    className="text-muted-foreground hover:text-primary transition-colors text-left"
                    data-testid="footer-link-contact"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openExternalLink('https://smartflowai.com/privacy')}
                    className="text-muted-foreground hover:text-primary transition-colors text-left"
                    data-testid="footer-link-privacy"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openExternalLink('https://smartflowai.com/terms')}
                    className="text-muted-foreground hover:text-primary transition-colors text-left"
                    data-testid="footer-link-terms"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <hr className="border-border my-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm" data-testid="footer-copyright">
              © 2024 SmartFlow AI. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm" data-testid="footer-made-with">
              Made with ❤️ using cutting-edge AI technology
            </p>
          </div>
        </GlassPanel>
      </div>
    </footer>
  );
}
