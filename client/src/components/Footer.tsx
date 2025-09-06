import GlassPanel from "./GlassPanel";

export default function Footer() {
  return (
    <footer className="px-6 py-12" data-testid="footer">
      <div className="max-w-6xl mx-auto">
        <GlassPanel className="p-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <i className="fas fa-robot text-black text-lg" data-testid="footer-logo-icon"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary" data-testid="footer-brand-name">SmartFlow AI</h3>
                  <p className="text-xs text-muted-foreground" data-testid="footer-brand-tagline">AI-Powered Content Generation</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4" data-testid="footer-description">
                Transform your creative process with AI-powered content generation. 
                Create stunning text and images in seconds.
              </p>
              <div className="flex space-x-4">
                <button className="w-10 h-10 border border-primary/30 rounded-full flex items-center justify-center hover:bg-primary hover:text-black transition-colors" data-testid="social-twitter">
                  <i className="fab fa-twitter"></i>
                </button>
                <button className="w-10 h-10 border border-primary/30 rounded-full flex items-center justify-center hover:bg-primary hover:text-black transition-colors" data-testid="social-linkedin">
                  <i className="fab fa-linkedin"></i>
                </button>
                <button className="w-10 h-10 border border-primary/30 rounded-full flex items-center justify-center hover:bg-primary hover:text-black transition-colors" data-testid="social-github">
                  <i className="fab fa-github"></i>
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" data-testid="footer-product-title">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-features">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-pricing">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-api">API</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-docs">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" data-testid="footer-support-title">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-help">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-contact">Contact Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-privacy">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-terms">Terms of Service</a></li>
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
