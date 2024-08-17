import { NextResponse } from 'next/server';
import { scrapeWebsite } from '../../../lib/scraper';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    const data = await scrapeWebsite(url);
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'An error occurred while scraping the website' }, { status: 500 });
  }
}