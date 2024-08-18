export interface ScrapedData {
    url: string;
    title: string;
    description: string;
    links: string[];
    scrapedAt: Date;
    category?: string;
  }

  // Interface to represent data structure of scraped data