import GlassPanel from "./GlassPanel";

const features = [
  {
    icon: "fas fa-bolt",
    title: "Lightning Fast",
    description: "Generate high-quality content in seconds with our optimized AI models"
  },
  {
    icon: "fas fa-palette",
    title: "Multiple Formats",
    description: "Create content for social media, blogs, emails, and more"
  },
  {
    icon: "fas fa-shield-alt",
    title: "Secure & Private",
    description: "Your data is encrypted and never stored or shared"
  },
  {
    icon: "fas fa-history",
    title: "Content History",
    description: "Access and manage all your generated content in one place"
  },
  {
    icon: "fas fa-cogs",
    title: "Custom Templates",
    description: "Save and reuse your favorite content templates"
  },
  {
    icon: "fas fa-share-alt",
    title: "Easy Sharing",
    description: "Export and share your content across platforms instantly"
  }
];

export default function Features() {
  return (
    <section className="px-6 py-12" data-testid="features-section">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" data-testid="features-title">Powerful AI Features</h2>
          <p className="text-muted-foreground text-lg" data-testid="features-description">Everything you need to create professional content</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <GlassPanel 
              key={index}
              className="p-6 text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className={`${feature.icon} text-black text-2xl`} data-testid={`feature-icon-${index}`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-3" data-testid={`feature-title-${index}`}>{feature.title}</h3>
              <p className="text-muted-foreground" data-testid={`feature-description-${index}`}>{feature.description}</p>
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  );
}
