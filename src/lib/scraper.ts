import axios from 'axios';
import * as cheerio from 'cheerio';
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import * as tf from '@tensorflow/tfjs';
import { ScrapedData } from '@/types/ScrapedData';

let model: tf.LayersModel | null = null;

// Function to load the trained model
async function loadModel() {
  if (!model) {
    model = await tf.loadLayersModel('localstorage://tech-category-model');
  }
}

// Function to tokenize text for the model
function tokenize(text: string): number[] {
  return text.split(' ').map((word) => word.length);
}

// Function to categorize the text using the model
async function categorizeText(text: string): Promise<string> {
  if (!model) {
    await loadModel();
  }

  const inputTensor = tf.tensor2d([tokenize(text)], [1, text.split(' ').length]);
  const prediction = model?.predict(inputTensor) as tf.Tensor;
  const categoryIndex = (await prediction.argMax(-1).data())[0];
  const categories = ["Search Engine", "Consumer Electronics", "Software", "E-commerce"];

  return categories[categoryIndex];
}

// Function to determine if the site requires JavaScript rendering
async function requiresSelenium(url: string): Promise<boolean> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const isDynamic = $('noscript').length > 0 || $('body').text().trim().length === 0;
    return isDynamic;
  } catch (error) {
    return true; // Fallback to Selenium if Axios fails
  }
}

// Function to create a driver based on the chosen browser
async function createDriver(browser: string): Promise<WebDriver> {
  let driver;

  switch (browser.toLowerCase()) {
    case 'chrome':
      driver = new Builder().forBrowser('chrome').build();
      break;
    case 'firefox':
      driver = new Builder().forBrowser('firefox').build();
      break;
    case 'edge':
      driver = new Builder().forBrowser('MicrosoftEdge').build();
      break;
    case 'safari':
      driver = new Builder().forBrowser('safari').build();
      break;
    default:
      throw new Error(`Unsupported browser: ${browser}`);
  }

  return driver;
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
async function scrapeWithSelenium(url: string, browser: string) {
  const driver = await createDriver(browser);

  try {
    await driver.get(url);

    // Wait for the page to load completely
    await driver.wait(until.elementLocated(By.tagName('body')), 10000);
    await driver.sleep(5000); // Wait for 5 seconds to ensure all dynamic content loads

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
export async function scrapeWebsite(url: string): Promise<ScrapedData> {
  const useSelenium = await requiresSelenium(url);
  const browser = process.env.BROWSER || 'chrome'; // Choose the browser, default is Chrome

  console.log(`Using ${useSelenium ? 'Selenium' : 'Axios'} for scraping ${url}`);

  let data;
  if (useSelenium) {
    data = await scrapeWithSelenium(url, browser);
  } else {
    data = await scrapeWithAxios(url);
  }

  // Categorize the text content of the scraped data
  const category = await categorizeText(data.description || data.title || '');

  // Return the complete scraped data including the category and URL
  return {
    url,
    title: data.title,
    description: data.description,
    links: data.links,
    scrapedAt: new Date(),
    category
  };
}

// Example usage
scrapeWebsite('example.com')
  .then(data => console.log(data))
  .catch(error => console.error('Error scraping:', error));
