import axios from 'axios'
import cheerio from 'cheerio'

export async function scrapeWebsite(url: string) {
  const { data } = await axios.get(url)
  const $ = cheerio.load(data)
  const title = $('h1').first().text()
  const paragraphs = $('p').map((_, el) => $(el).text()).get()
  return { title, paragraphs }
}