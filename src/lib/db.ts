import { MongoClient } from 'mongodb'
import clientPromise from './mongodb'
import { ScrapedData } from '../types/ScrapedData'

export async function saveScrapedData(data: ScrapedData): Promise<void> {
  const client = await clientPromise
  const db = client.db("scraper_db")
  await db.collection("scraped_data").insertOne(data)
}

export async function getScrapedData(url: string): Promise<ScrapedData | null> {
  const client = await clientPromise
  const db = client.db("scraper_db")
  const result = await db.collection("scraped_data").findOne({ url })

  if (result) {
    return {
      url: result.url,
      title: result.title,
      description: result.description,
      links: result.links,
      scrapedAt: new Date(result.scrapedAt),
    }
  }

  return null
}