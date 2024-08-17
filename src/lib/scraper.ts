import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScrapedData } from '@/types/ScrapedData';

export async function scrapeWebsite(url: string): Promise<Omit<ScrapedData, 'url' | 'scrapedAt'>> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    const title = $('title').first().text().trim() || $('h1').first().text().trim();
    const description = $('meta[name="description"]').attr('content') || $('p').first().text().trim();
    const links = $('a').map((_, el) => $(el).attr('href')).get();

    return { title, description, links };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('Page not found');
    }
    throw new Error('Failed to scrape website');
  }
}

// Example usage
scrapeWebsite('https://www.example.com')
  .then(data => console.log(data));