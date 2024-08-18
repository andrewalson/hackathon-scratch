# Static & Dynamic Web Scraper Project
## Headstarter Wk. 4 Hackathon - Olostep Track

Next.js-based web scraping application that allows users to scrape static sites using Axois & Cheerio and dynamic sites using Selenium and view the results in a single page UI.

Built by Headstarter fellows [Andrew Alson](https://www.linkedin.com/in/andrewalson/) and [Saikiran Somanagoudar](https://www.linkedin.com/in/saikiransomanagoudar/) in 36 hours.

## Features
- Static and dynamic web scraping capabilities
- MongoDB integration for data storage
- Responsive design, light/dark mode

## Project Structure
- src/app/: Contains the main application components and pages
- src/lib/: Houses utility functions and database connections
- src/types/: Defines TypeScript interfaces
- src/training/: Contains machine learning model training scripts for TensorFlow scrape output categorization (WIP)

## Getting Started

### Prerequisites
- Node.js (version 14 or later)
- npm or yarn
- MongoDB database

### Installation
- `git clone https://github.com/andrewalson/hackathon-scratch.git`
- `cd hackathon-scratch`
- `npm install`
- Create a `.env.local` file with the following variables:
  - `MONGODB_URI=your_mongodb_uri`
- `npm run dev`
- Open [http://localhost:3000](http://localhost:3000) to view the application in the browser.