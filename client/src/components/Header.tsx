import GlassPanel from "./GlassPanel";

export default function Header() {
  return (
    <header className="p-6" data-testid="header">
      <nav className="max-w-4xl mx-auto">
        <GlassPanel className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <i className="fas fa-robot text-black text-lg" data-testid="logo-icon"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary" data-testid="brand-name">SmartFlow AI</h1>
                <p className="text-xs text-muted-foreground" data-testid="brand-tagline">AI-Powered Content Generation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-dashboard"
              >
                Dashboard
              </button>
              <button 
                className="px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-history"
              >
                History
              </button>
              <button 
                className="btn-gold px-6 py-2 rounded-xl text-sm font-medium"
                data-testid="nav-account"
              >
                <i className="fas fa-user mr-2"></i>Account
              </button>
            </div>
          </div>
        </GlassPanel>
      </nav>
    </header>
  );
}
