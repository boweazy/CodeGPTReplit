import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import GlassPanel from "./GlassPanel";
import { useToast } from "@/hooks/use-toast";

interface TextGenerationRequest {
  prompt: string;
  contentType: string;
  tone: string;
  length: string;
}

interface ImageGenerationRequest {
  prompt: string;
  style: string;
  aspectRatio: string;
  quality: string;
}

export default function ContentGenerator() {
  const { toast } = useToast();
  
  // Text generation state
  const [textPrompt, setTextPrompt] = useState("");
  const [contentType, setContentType] = useState("Social Media Post");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Short (50-150 words)");
  const [generatedText, setGeneratedText] = useState("");

  // Image generation state
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageStyle, setImageStyle] = useState("Photorealistic");
  const [aspectRatio, setAspectRatio] = useState("Square (1:1)");
  const [quality, setQuality] = useState("Standard");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");

  const textMutation = useMutation({
    mutationFn: async (data: TextGenerationRequest) => {
      const response = await apiRequest("POST", "/api/ai/text", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setGeneratedText(data.text);
        toast({
          title: "Success",
          description: "Content generated successfully!",
        });
      } else {
        throw new Error(data.error);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate text",
        variant: "destructive",
      });
    },
  });

  const imageMutation = useMutation({
    mutationFn: async (data: ImageGenerationRequest) => {
      const response = await apiRequest("POST", "/api/ai/image", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setGeneratedImageUrl(data.url);
        toast({
          title: "Success",
          description: "Image generated successfully!",
        });
      } else {
        throw new Error(data.error);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate image",
        variant: "destructive",
      });
    },
  });

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a content idea",
        variant: "destructive",
      });
      return;
    }
    
    textMutation.mutate({
      prompt: textPrompt,
      contentType,
      tone,
      length,
    });
  };

  const handleImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePrompt.trim()) {
      toast({
        title: "Error",
        description: "Please describe your image",
        variant: "destructive",
      });
      return;
    }
    
    imageMutation.mutate({
      prompt: imagePrompt,
      style: imageStyle,
      aspectRatio,
      quality,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard!",
    });
  };

  return (
    <section className="px-6 py-12" data-testid="content-generator">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Text Generation Panel */}
          <GlassPanel className="p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mr-4">
                <i className="fas fa-pen text-black text-lg"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold" data-testid="text-generator-title">AI Text Generator</h2>
                <p className="text-muted-foreground">Create engaging content with GPT-5</p>
              </div>
            </div>

            <form onSubmit={handleTextSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Content Type</label>
                <select 
                  className="input-glass w-full px-4 py-3 rounded-xl text-foreground focus:outline-none transition-all"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  data-testid="select-content-type"
                >
                  <option value="Social Media Post">Social Media Post</option>
                  <option value="Blog Article">Blog Article</option>
                  <option value="Product Description">Product Description</option>
                  <option value="Email Newsletter">Email Newsletter</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Describe your content idea</label>
                <textarea 
                  placeholder="e.g., Write a social media post about sustainable fashion trends for young adults..."
                  className="input-glass w-full px-4 py-3 rounded-xl text-foreground placeholder-muted-foreground resize-none focus:outline-none transition-all h-32"
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                  data-testid="textarea-text-prompt"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-3">Tone</label>
                  <select 
                    className="input-glass w-full px-4 py-3 rounded-xl text-foreground focus:outline-none transition-all"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    data-testid="select-tone"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Casual">Casual</option>
                    <option value="Humorous">Humorous</option>
                    <option value="Inspiring">Inspiring</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3">Length</label>
                  <select 
                    className="input-glass w-full px-4 py-3 rounded-xl text-foreground focus:outline-none transition-all"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    data-testid="select-length"
                  >
                    <option value="Short (50-150 words)">Short (50-150 words)</option>
                    <option value="Medium (150-300 words)">Medium (150-300 words)</option>
                    <option value="Long (300+ words)">Long (300+ words)</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-gold w-full py-4 rounded-xl font-semibold text-lg"
                disabled={textMutation.isPending}
                data-testid="button-generate-text"
              >
                <i className="fas fa-magic mr-3"></i>
                {textMutation.isPending ? "Generating..." : "Generate Content"}
              </button>
            </form>

            <div className="mt-8 p-6 input-glass rounded-xl" data-testid="text-output-container">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-primary">Generated Content</h3>
                {generatedText && (
                  <button 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => copyToClipboard(generatedText)}
                    data-testid="button-copy-text"
                  >
                    <i className="fas fa-copy mr-1"></i>Copy
                  </button>
                )}
              </div>
              <div className="text-sm leading-relaxed" data-testid="text-generated-content">
                {textMutation.isPending ? (
                  <div className="text-muted-foreground">Generating content...</div>
                ) : generatedText ? (
                  <div className="whitespace-pre-wrap">{generatedText}</div>
                ) : (
                  <div className="text-muted-foreground">
                    Your AI-generated content will appear here. Click the generate button above to create engaging content tailored to your specifications.
                  </div>
                )}
              </div>
            </div>
          </GlassPanel>

          {/* Image Generation Panel */}
          <GlassPanel className="p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mr-4">
                <i className="fas fa-image text-black text-lg"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold" data-testid="image-generator-title">AI Image Generator</h2>
                <p className="text-muted-foreground">Create stunning visuals with DALL-E 3</p>
              </div>
            </div>

            <form onSubmit={handleImageSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Image Style</label>
                <select 
                  className="input-glass w-full px-4 py-3 rounded-xl text-foreground focus:outline-none transition-all"
                  value={imageStyle}
                  onChange={(e) => setImageStyle(e.target.value)}
                  data-testid="select-image-style"
                >
                  <option value="Photorealistic">Photorealistic</option>
                  <option value="Digital Art">Digital Art</option>
                  <option value="Illustration">Illustration</option>
                  <option value="Abstract">Abstract</option>
                  <option value="Cartoon">Cartoon</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Describe your image</label>
                <textarea 
                  placeholder="e.g., A modern workspace with natural lighting, plants, and a laptop displaying colorful charts..."
                  className="input-glass w-full px-4 py-3 rounded-xl text-foreground placeholder-muted-foreground resize-none focus:outline-none transition-all h-32"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  data-testid="textarea-image-prompt"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-3">Aspect Ratio</label>
                  <select 
                    className="input-glass w-full px-4 py-3 rounded-xl text-foreground focus:outline-none transition-all"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    data-testid="select-aspect-ratio"
                  >
                    <option value="Square (1:1)">Square (1:1)</option>
                    <option value="Landscape (16:9)">Landscape (16:9)</option>
                    <option value="Portrait (9:16)">Portrait (9:16)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3">Quality</label>
                  <select 
                    className="input-glass w-full px-4 py-3 rounded-xl text-foreground focus:outline-none transition-all"
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    data-testid="select-quality"
                  >
                    <option value="Standard">Standard</option>
                    <option value="HD">HD</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-gold w-full py-4 rounded-xl font-semibold text-lg"
                disabled={imageMutation.isPending}
                data-testid="button-generate-image"
              >
                <i className="fas fa-palette mr-3"></i>
                {imageMutation.isPending ? "Generating..." : "Generate Image"}
              </button>
            </form>

            <div className="mt-8 p-6 input-glass rounded-xl" data-testid="image-output-container">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-primary">Generated Image</h3>
                {generatedImageUrl && (
                  <a 
                    href={generatedImageUrl}
                    download
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    data-testid="button-download-image"
                  >
                    <i className="fas fa-download mr-1"></i>Download
                  </a>
                )}
              </div>
              <div className="aspect-square bg-muted/20 rounded-xl flex items-center justify-center text-muted-foreground" data-testid="image-generated-content">
                {imageMutation.isPending ? (
                  <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-4xl mb-3 opacity-50"></i>
                    <p className="text-sm">Generating image...</p>
                  </div>
                ) : generatedImageUrl ? (
                  <img 
                    src={generatedImageUrl} 
                    alt="Generated content" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="text-center">
                    <i className="fas fa-image text-4xl mb-3 opacity-50"></i>
                    <p className="text-sm">Your AI-generated image will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </section>
  );
}
