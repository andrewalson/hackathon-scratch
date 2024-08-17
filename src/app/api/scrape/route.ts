import { NextResponse } from 'next/server'
import { scrapeWebsite } from '@/lib/scraper'
import { saveScrapedData, getScrapedData } from '@/lib/db'
import { ScrapedData } from '@/types/ScrapedData'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Check if we already have scraped data for this URL
    let data: ScrapedData | null
    try {
      data = await getScrapedData(url)
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Database error occurred' }, { status: 500 })
    }

    if (!data) {
      // If not, scrape the website and save the data
      let scrapedData
      try {
        scrapedData = await scrapeWebsite(url)
      } catch (scrapeError) {
        console.error('Scraping error:', scrapeError)
        return NextResponse.json({ error: 'Failed to scrape website' }, { status: 500 })
      }

      const newData: ScrapedData = {
        url,
        ...scrapedData,
        scrapedAt: new Date()
      }

      try {
        await saveScrapedData(newData)
      } catch (saveError) {
        console.error('Error saving data:', saveError)
        return NextResponse.json({ error: 'Failed to save scraped data' }, { status: 500 })
      }

      data = newData
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error in scrape API route:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}