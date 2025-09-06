import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || ""
});

export interface TextGenerationRequest {
  prompt: string;
  contentType?: string;
  tone?: string;
  length?: string;
}

export interface ImageGenerationRequest {
  prompt: string;
  style?: string;
  aspectRatio?: string;
  quality?: string;
}

export async function generateText(request: TextGenerationRequest): Promise<string> {
  try {
    const { prompt, contentType = "general", tone = "professional", length = "medium" } = request;
    
    const systemPrompt = `You are an expert content creator. Generate ${length} ${contentType} content with a ${tone} tone. 
    Provide high-quality, engaging content that matches the user's requirements exactly.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: length === "short" ? 200 : length === "long" ? 800 : 400,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "Failed to generate content";
  } catch (error) {
    console.error("Text generation error:", error);
    throw new Error(`Failed to generate text: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateImage(request: ImageGenerationRequest): Promise<string> {
  try {
    const { prompt, quality = "standard" } = request;
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: quality as "standard" | "hd",
    });

    if (!response.data || !response.data[0] || !response.data[0].url) {
      throw new Error("No image URL returned from OpenAI");
    }

    return response.data[0].url;
  } catch (error) {
    console.error("Image generation error:", error);
    throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
