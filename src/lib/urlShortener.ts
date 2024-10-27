import { z } from 'zod';

const shortIoResponseSchema = z.object({
  shortURL: z.string(),
  secureShortURL: z.string(),
});

export async function shortenUrl(longUrl: string): Promise<string> {
  const apiKey = import.meta.env.VITE_SHORT_IO_API_KEY_PUBLIC;
  const domain = 'grou.short.gy';
  
  if (!apiKey) {
    console.warn('Short.io API key missing');
    return longUrl;
  }

  try {
    const response = await fetch('https://api.short.io/links/public', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'authorization': apiKey
      },
      body: JSON.stringify({
        domain,
        originalURL: longUrl,
        allowDuplicates: true
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const parsed = shortIoResponseSchema.safeParse(data);
    
    if (!parsed.success) {
      throw new Error(`Invalid API response: ${JSON.stringify(parsed.error.errors)}`);
    }

    return parsed.data.secureShortURL;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error shortening URL:', error.message);
    } else {
      console.error('Unknown error shortening URL:', error);
    }
    return longUrl; // Fallback to original URL
  }
}