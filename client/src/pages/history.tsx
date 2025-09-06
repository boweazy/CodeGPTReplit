import StarField from "@/components/StarField";
import Header from "@/components/Header";
import GlassPanel from "@/components/GlassPanel";
import { useState } from "react";

export default function History() {
  const [filter, setFilter] = useState<'all' | 'text' | 'image'>('all');

  // Mock data for demonstration
  const mockHistory = [
    {
      id: '1',
      type: 'text' as const,
      prompt: 'Write a social media post about sustainable fashion',
      result: 'Embrace sustainable fashion! 🌱 Choose quality over quantity, support ethical brands, and give your clothes a second life. Together, we can make fashion more sustainable while looking fabulous! #SustainableFashion #EcoFriendly',
      createdAt: new Date('2024-01-15T10:30:00'),
    },
    {
      id: '2',
      type: 'image' as const,
      prompt: 'A modern workspace with natural lighting and plants',
      result: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=400&fit=crop',
      createdAt: new Date('2024-01-14T15:45:00'),
    },
    {
      id: '3',
      type: 'text' as const,
      prompt: 'Create a product description for eco-friendly water bottle',
      result: 'Introducing our EcoFlow water bottle - crafted from 100% recycled stainless steel. Features double-wall insulation to keep drinks cold for 24 hours or hot for 12 hours. BPA-free, leak-proof design with a lifetime warranty. Perfect for conscious consumers who care about the planet.',
      createdAt: new Date('2024-01-13T09:15:00'),
    }
  ];

  const filteredHistory = filter === 'all' 
    ? mockHistory 
    : mockHistory.filter(item => item.type === filter);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden" data-testid="history-page">
      <StarField />
      
      <div className="relative z-10">
        <Header />
        
        <main className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <GlassPanel className="p-8 text-center">
                <h1 className="text-4xl font-bold mb-4 text-primary" data-testid="history-title">
                  Generation History
                </h1>
                <p className="text-muted-foreground text-lg" data-testid="history-description">
                  View and manage your AI-generated content
                </p>
              </GlassPanel>
            </div>

            {/* Filter Tabs */}
            <GlassPanel className="p-6 mb-8">
              <div className="flex justify-center space-x-1">
                {[
                  { key: 'all' as const, label: 'All Content', icon: 'fas fa-list' },
                  { key: 'text' as const, label: 'Text', icon: 'fas fa-pen' },
                  { key: 'image' as const, label: 'Images', icon: 'fas fa-image' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                      filter === tab.key 
                        ? 'btn-gold' 
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                    data-testid={`filter-${tab.key}`}
                  >
                    <i className={`${tab.icon} mr-2`}></i>
                    {tab.label}
                  </button>
                ))}
              </div>
            </GlassPanel>

            {/* History Items */}
            <div className="space-y-6">
              {filteredHistory.length === 0 ? (
                <GlassPanel className="p-12 text-center">
                  <i className="fas fa-history text-4xl text-muted-foreground mb-4"></i>
                  <h3 className="text-xl font-semibold mb-2">No content found</h3>
                  <p className="text-muted-foreground">Start generating content to see your history here!</p>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="btn-gold px-6 py-3 rounded-xl font-medium mt-6"
                    data-testid="start-generating-button"
                  >
                    Start Generating
                  </button>
                </GlassPanel>
              ) : (
                filteredHistory.map(item => (
                  <GlassPanel key={item.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mr-4">
                          <i className={`${item.type === 'text' ? 'fas fa-pen' : 'fas fa-image'} text-black`}></i>
                        </div>
                        <div>
                          <h3 className="font-semibold text-primary capitalize">{item.type} Generation</h3>
                          <p className="text-sm text-muted-foreground">{formatDate(item.createdAt)}</p>
                        </div>
                      </div>
                      <button className="text-muted-foreground hover:text-primary transition-colors" data-testid={`copy-${item.id}`}>
                        <i className="fas fa-copy"></i>
                      </button>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Prompt:</h4>
                      <p className="text-sm bg-muted/20 rounded-lg p-3 border border-border">{item.prompt}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Result:</h4>
                      {item.type === 'text' ? (
                        <p className="text-sm bg-muted/20 rounded-lg p-3 border border-border whitespace-pre-wrap">{item.result}</p>
                      ) : (
                        <div className="bg-muted/20 rounded-lg p-3 border border-border">
                          <img 
                            src={item.result} 
                            alt="Generated content" 
                            className="w-full max-w-sm rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZmlsbD0iIzk5OSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkltYWdlPC90ZXh0Pgo8L3N2Zz4K';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </GlassPanel>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}