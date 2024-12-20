import OpenAI from 'openai';

// Initialize OpenAI with error handling
const createOpenAIClient = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  return new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });
};

const openai = createOpenAIClient();

export async function generateSummary(content: string): Promise<string> {
  if (!content.trim()) {
    return '';
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a skilled editor who creates concise, engaging blog post summaries. Focus on the main points and key takeaways."
        },
        {
          role: "user",
          content: `Please generate a compelling 2-3 sentence summary of this blog post:\n\n${content}`
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return response.choices[0].message.content?.trim() || '';
  } catch (error: any) {
    console.error('Error generating summary:', error);
    if (error?.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your configuration.');
    }
    throw new Error('Failed to generate summary. Please try again later.');
  }
}

export async function generateTags(content: string): Promise<string[]> {
  if (!content.trim()) {
    return [];
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a content categorization expert. Extract relevant tags from blog posts."
        },
        {
          role: "user",
          content: `Generate 3-5 relevant tags for this blog post. Return only the tags separated by commas:\n\n${content}`
        }
      ],
      temperature: 0.5,
      max_tokens: 50
    });

    const tags = response.choices[0].message.content?.split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0) || [];
      
    return tags;
  } catch (error) {
    console.error('Error generating tags:', error);
    return [];
  }
}