'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      const circles = document.querySelectorAll<HTMLElement>('.circle');

      circles.forEach((circle, index) => {
        const speed = (index + 1) * 0.05;
        const xPos = (x * speed) - 50; // Adjust the value to center circles
        const yPos = (y * speed) - 50; // Adjust the value to center circles

        circle.style.transform = `translate(${xPos}px, ${yPos}px)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#1E1E2F', color: '#fff', fontFamily: '"Courier New", Courier, monospace', position: 'relative', overflow: 'hidden' }}>
      {/* Circles that follow mouse movement */}
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>
      <div className="circle circle3"></div>

      <div style={{ backgroundColor: '#2B2B3C', padding: '40px', borderRadius: '12px', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.5)', maxWidth: '500px', width: '100%', zIndex: 10 }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px', textAlign: 'center', color: '#61dafb', fontFamily: '"Source Code Pro", monospace' }}>Web Scraper</h1>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
            placeholder="Enter URL to scrape"
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '8px',
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              backgroundColor: '#3C3C4F',
              color: '#fff',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleScrape}
            disabled={loading}
            style={{
              padding: '12px 30px',
              borderRadius: '8px',
              backgroundColor: '#61dafb',
              color: '#1E1E2F',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              border: 'none',
              transition: 'background-color 0.3s ease, transform 0.3s ease',
              boxShadow: '0px 4px 12px rgba(97, 218, 251, 0.3)',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {loading ? 'Scraping...' : 'Scrape'}
          </button>
        </div>
        {error && <p style={{ color: '#ff6b6b', marginTop: '20px', textAlign: 'center' }}>{error}</p>}
        {result && (
          <div style={{ marginTop: '20px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#61dafb' }}>{result.title}</h2>
            {result.paragraphs && result.paragraphs.length > 0 && (
              <>
                <h3 style={{ fontSize: '1.2rem', color: '#61dafb' }}>Paragraphs:</h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', lineHeight: '1.5' }}>
                  {result.paragraphs.map((p: string, i: number) => (
                    <li key={i} style={{ marginBottom: '10px' }}>{p}</li>
                  ))}
                </ul>
              </>
            )}
            {result.links && result.links.length > 0 && (
              <>
                <h3 style={{ fontSize: '1.2rem', color: '#61dafb' }}>Links:</h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', lineHeight: '1.5' }}>
                  {result.links.map((link: string, i: number) => (
                    <li key={i} style={{ marginBottom: '10px' }}>{link}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>

      {/* Add CSS for responsive circles */}
      <style jsx>{`
        .circle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          opacity: 0.2;
          transition: transform 0.2s ease-out;
        }

        .circle1 {
          width: 150px;
          height: 150px;
          background: rgba(97, 218, 251, 0.4);
          top: 10%;
          left: 15%;
        }

        .circle2 {
          width: 200px;
          height: 200px;
          background: rgba(97, 218, 251, 0.3);
          top: 50%;
          left: 60%;
        }

        .circle3 {
          width: 100px;
          height: 100px;
          background: rgba(97, 218, 251, 0.5);
          top: 80%;
          left: 25%;
        }

        body {
          margin: 0;
          overflow: hidden;
          background-color: #1E1E2F;
        }
      `}</style>
    </div>
  );
}
