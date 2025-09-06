import GlassPanel from "./GlassPanel";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="p-6" data-testid="header">
      <nav className="max-w-4xl mx-auto">
        <GlassPanel className="px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <i className="fas fa-robot text-black text-lg" data-testid="logo-icon"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary" data-testid="brand-name">SmartFlow AI</h1>
                <p className="text-xs text-muted-foreground" data-testid="brand-tagline">AI-Powered Content Generation</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className={`px-4 py-2 text-sm transition-colors ${
                  isActive('/dashboard') 
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
                data-testid="nav-dashboard"
              >
                <i className="fas fa-tachometer-alt mr-2"></i>Dashboard
              </Link>
              <Link 
                href="/history"
                className={`px-4 py-2 text-sm transition-colors ${
                  isActive('/history') 
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
                data-testid="nav-history"
              >
                <i className="fas fa-history mr-2"></i>History
              </Link>
              <Link 
                href="/account"
                className="btn-gold px-6 py-2 rounded-xl text-sm font-medium"
                data-testid="nav-account"
              >
                <i className="fas fa-user mr-2"></i>Account
              </Link>
            </div>
          </div>
        </GlassPanel>
      </nav>
    </header>
  );
}
