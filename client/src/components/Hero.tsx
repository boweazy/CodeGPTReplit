import GlassPanel from "./GlassPanel";

export default function Hero() {
  return (
    <section className="px-6 py-12" data-testid="hero-section">
      <div className="max-w-4xl mx-auto text-center">
        <GlassPanel className="p-12" animate>
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-4" data-testid="hero-title">
              Create Stunning Content with{' '}
              <span className="text-primary">AI Magic</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed" data-testid="hero-description">
              Transform your ideas into engaging posts, images, and stories using cutting-edge AI technology. 
              Perfect for creators, marketers, and businesses.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8" data-testid="hero-features">
            <div className="flex items-center px-4 py-2 rounded-full border border-primary/30">
              <i className="fas fa-check text-primary mr-2"></i>
              <span className="text-sm">GPT-5 Powered</span>
            </div>
            <div className="flex items-center px-4 py-2 rounded-full border border-primary/30">
              <i className="fas fa-check text-primary mr-2"></i>
              <span className="text-sm">DALL-E 3 Images</span>
            </div>
            <div className="flex items-center px-4 py-2 rounded-full border border-primary/30">
              <i className="fas fa-check text-primary mr-2"></i>
              <span className="text-sm">Real-time Generation</span>
            </div>
          </div>

          <button 
            className="btn-gold px-8 py-4 rounded-2xl text-lg font-semibold animate-glow"
            data-testid="hero-cta-button"
          >
            <i className="fas fa-magic mr-3"></i>Start Creating
          </button>
        </GlassPanel>
      </div>
    </section>
  );
}
