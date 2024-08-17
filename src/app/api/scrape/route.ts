import { NextResponse } from 'next/server'
import { scrapeWebsite } from '@/lib/scraper'

export async function POST(request: Request) {
  const { url } = await request.json()
  try {
    const data = await scrapeWebsite(url)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to scrape website' }, { status: 500 })
  }
}