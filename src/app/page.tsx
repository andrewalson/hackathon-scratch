// src/app/page.tsx

'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to scrape website');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Web Scraper</h1>
      <div className="mb-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to scrape"
          className="border p-2 mr-2"
        />
        <button
          onClick={handleScrape}
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {loading ? 'Scraping...' : 'Scrape'}
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {result && (
        <div>
          <h2 className="text-xl font-bold">{result.title}</h2>
          {result.paragraphs && result.paragraphs.length > 0 && (
            <>
              <h3 className="font-bold mt-2">Paragraphs:</h3>
              <ul className="list-disc pl-5">
                {result.paragraphs.map((p: string, i: number) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </>
          )}
          {result.links && result.links.length > 0 && (
            <>
              <h3 className="font-bold mt-2">Links:</h3>
              <ul className="list-disc pl-5">
                {result.links.map((link: string, i: number) => (
                  <li key={i}>{link}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}