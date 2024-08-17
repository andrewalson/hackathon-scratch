const axios = require('axios');
const cheerio = require('cheerio');

export async function scrapeWebsite(url: string) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const title = $('h1').text() || '';
    const description = $('meta[name="description"]').attr('content') || '';
    const links = $('a').map((i: number, el: cheerio.Element) => $(el).attr('href')).get();

    return { title, description, links };

  } catch (error) {
    console.error('Error scraping website:', error);
    throw error; // Re-throw the error to be handled by the API route
  }
}

// Example usage
scrapeWebsite('https://www.example.com')
  .then(data => console.log(data));