import StarField from "@/components/StarField";
import Header from "@/components/Header";
import GlassPanel from "@/components/GlassPanel";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { data: generations } = useQuery({
    queryKey: ['/api/ai/generations'],
    queryFn: async () => {
      // Mock data for now since we don't have user auth yet
      return [];
    }
  });

  const stats = [
    { label: "Total Generations", value: "47", icon: "fas fa-magic" },
    { label: "Text Content", value: "32", icon: "fas fa-pen" },
    { label: "Images Created", value: "15", icon: "fas fa-image" },
    { label: "This Month", value: "12", icon: "fas fa-calendar" }
  ];

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden" data-testid="dashboard-page">
      <StarField />
      
      <div className="relative z-10">
        <Header />
        
        <main className="px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <GlassPanel className="p-8 text-center">
                <h1 className="text-4xl font-bold mb-4 text-primary" data-testid="dashboard-title">
                  Content Dashboard
                </h1>
                <p className="text-muted-foreground text-lg" data-testid="dashboard-description">
                  Manage and track your AI-generated content
                </p>
              </GlassPanel>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <GlassPanel key={index} className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                    <i className={`${stat.icon} text-black text-xl`} data-testid={`stat-icon-${index}`}></i>
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2" data-testid={`stat-value-${index}`}>
                    {stat.value}
                  </div>
                  <p className="text-muted-foreground text-sm" data-testid={`stat-label-${index}`}>
                    {stat.label}
                  </p>
                </GlassPanel>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-8">
              <GlassPanel className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-primary" data-testid="quick-text-title">
                  Quick Text Generation
                </h2>
                <p className="text-muted-foreground mb-6">
                  Generate content instantly with our AI-powered text generator
                </p>
                <button 
                  className="btn-gold w-full py-3 rounded-xl font-semibold"
                  onClick={() => window.location.href = '/#text-generator'}
                  data-testid="quick-text-button"
                >
                  <i className="fas fa-pen mr-2"></i>Start Writing
                </button>
              </GlassPanel>

              <GlassPanel className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-primary" data-testid="quick-image-title">
                  Quick Image Creation
                </h2>
                <p className="text-muted-foreground mb-6">
                  Create stunning visuals with DALL-E 3 image generation
                </p>
                <button 
                  className="btn-gold w-full py-3 rounded-xl font-semibold"
                  onClick={() => window.location.href = '/#image-generator'}
                  data-testid="quick-image-button"
                >
                  <i className="fas fa-image mr-2"></i>Create Image
                </button>
              </GlassPanel>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}