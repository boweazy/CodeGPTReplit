import GlassPanel from "./GlassPanel";

const stats = [
  {
    value: "50K+",
    label: "Content Pieces Generated"
  },
  {
    value: "12K+",
    label: "Happy Users"
  },
  {
    value: "99.9%",
    label: "Uptime"
  }
];

export default function Stats() {
  return (
    <section className="px-6 py-12" data-testid="stats-section">
      <div className="max-w-4xl mx-auto">
        <GlassPanel className="p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-primary mb-2" data-testid={`stat-value-${index}`}>{stat.value}</div>
                <p className="text-muted-foreground" data-testid={`stat-label-${index}`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
