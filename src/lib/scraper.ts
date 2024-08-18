import axios from 'axios';
import * as cheerio from 'cheerio';
import { Builder, By, until } from 'selenium-webdriver';
import { ScrapedData } from '@/types/ScrapedData';

// Function to determine if the site requires JavaScript rendering
async function requiresSelenium(url: string): Promise<boolean> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    // Example check: if the page contains specific JS-based content or lacks standard HTML elements
    const isDynamic = $('noscript').length > 0 || $('body').text().trim().length === 0;
    return isDynamic;
  } catch (error) {
    return true; // Fallback to Selenium if Axios fails
  }
}

// Scrape with Axios and Cheerio (for static websites)
async function scrapeWithAxios(url: string) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  const title = $('title').first().text().trim() || $('h1').first().text().trim();
  const description = $('meta[name="description"]').attr('content') || $('p').first().text().trim();
  const links = $('a').map((_, el) => $(el).attr('href')).get();
  const images = $('img').map((_, el) => $(el).attr('src')).get();
  const videos = $('video source').map((_, el) => $(el).attr('src')).get();
  const iframes = $('iframe').map((_, el) => $(el).attr('src')).get();

  return { title, description, links, images, videos: [...videos, ...iframes] };
}

// Scrape with Selenium (for dynamic websites)
async function scrapeWithSelenium(url: string) {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get(url);

    // Wait for the page to load completely
    await driver.wait(until.elementLocated(By.tagName('body')), 10000);

    const title = await driver.getTitle();
    const descriptionElement = await driver.findElement(By.name('description'));
    const description = descriptionElement ? await descriptionElement.getAttribute('content') : '';
    
    const links = await driver.findElements(By.tagName('a'));
    const linkHrefs = await Promise.all(links.map(async (link) => await link.getAttribute('href')));

    const images = await driver.findElements(By.tagName('img'));
    const imageSources = await Promise.all(images.map(async (img) => await img.getAttribute('src')));

    const videos = await driver.findElements(By.tagName('video source'));
    const videoSources = await Promise.all(videos.map(async (vid) => await vid.getAttribute('src')));

    const iframes = await driver.findElements(By.tagName('iframe'));
    const iframeSources = await Promise.all(iframes.map(async (iframe) => await iframe.getAttribute('src')));

    return { title, description, links: linkHrefs, images: imageSources, videos: [...videoSources, ...iframeSources] };
  } finally {
    await driver.quit();
  }
}

// Unified function to scrape websites (decides between Axios/Cheerio and Selenium)
export async function scrapeWebsite(url: string): Promise<Omit<ScrapedData, 'url' | 'scrapedAt'>> {
  const useSelenium = await requiresSelenium(url);
  
  if (useSelenium) {
    return scrapeWithSelenium(url);
  } else {
    return scrapeWithAxios(url);
  }
}

// Example usage
scrapeWebsite('https://www.example.com')
  .then(data => console.log(data))
  .catch(error => console.error('Error scraping:', error));
