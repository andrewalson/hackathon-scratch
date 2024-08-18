'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [staticUrl, setStaticUrl] = useState('');
  const [dynamicUrl, setDynamicUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lightMode, setLightMode] = useState(false);

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

  const handleStaticScrape = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: staticUrl }),
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

  const handleDynamicScrape = () => {
    // Placeholder for future dynamic scraping functionality
    alert('Dynamic scraping functionality not yet implemented');
  };

  const toggleLightMode = () => {
    setLightMode(!lightMode);
  };

  const bgColor = lightMode ? '#F0F0F0' : '#1E1E2F';
  const cardBgColor = lightMode ? '#FFFFFF' : '#2B2B3C';
  const textColor = lightMode ? '#333333' : '#fff';

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: bgColor,
      color: textColor,
      fontFamily: '"Courier New", Courier, monospace',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px',
      transition: 'background-color 0.3s ease, color 0.3s ease',
    }}>
      {/* Light Mode Toggle */}
      <button
        onClick={toggleLightMode}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          zIndex: 20,
        }}
        aria-label={lightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      >
        {lightMode ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.25V4.75M12 19.25V21.75M4.75 12H2.25M21.75 12H19.25M18.364 18.364L16.95 16.95M7.05 7.05L5.636 5.636M16.95 7.05L18.364 5.636M5.636 18.364L7.05 16.95M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="#1E1E2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.752 15.002C20.5633 15.4975 19.2879 15.7517 18 15.75C13.4436 15.75 9.75 12.0564 9.75 7.5C9.75 6.21213 10.0042 4.93666 10.4997 3.74805C6.64772 4.85199 3.75 8.42714 3.75 12.75C3.75 17.7206 7.77944 21.75 12.75 21.75C17.0729 21.75 20.648 18.8523 21.752 15.002Z" stroke="#61dafb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Circles that follow mouse movement */}
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>
      <div className="circle circle3"></div>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '20px',
        zIndex: 10,
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        {/* Static Scraper */}
        <div style={{ backgroundColor: cardBgColor, padding: '40px', borderRadius: '12px', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.5)', maxWidth: '500px', width: '100%', transition: 'background-color 0.3s ease' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '20px', textAlign: 'center', color: '#61dafb', fontFamily: '"Source Code Pro", monospace' }}>Static Web Scraper</h1>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              value={staticUrl}
              onChange={(e) => setStaticUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStaticScrape()}
              placeholder="Enter static URL to scrape"
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
              onClick={handleStaticScrape}
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
              {loading ? 'Scraping...' : 'Scrape Static Site'}
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

        {/* Dynamic Scraper */}
        <div style={{ backgroundColor: cardBgColor, padding: '40px', borderRadius: '12px', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.5)', maxWidth: '500px', width: '100%', transition: 'background-color 0.3s ease' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '20px', textAlign: 'center', color: '#61dafb', fontFamily: '"Source Code Pro", monospace' }}>Dynamic Web Scraper</h1>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              value={dynamicUrl}
              onChange={(e) => setDynamicUrl(e.target.value)}
              placeholder="Enter dynamic URL to scrape"
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
              onClick={handleDynamicScrape}
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
              Scrape Dynamic Site (Not Implemented)
            </button>
          </div>
          <p style={{ marginTop: '20px', textAlign: 'center', color: '#ff6b6b' }}>Dynamic scraping functionality is not yet implemented.</p>
        </div>
      </div>

      <style jsx>{`
        .circle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          opacity: ${lightMode ? '0.3' : '0.2'};
          transition: opacity 0.3s ease, transform 0.2s ease-out, background-color 0.3s ease;
        }

        .circle1 {
          width: 150px;
          height: 150px;
          background: ${lightMode ? 'rgba(97, 218, 251, 0.6)' : 'rgba(97, 218, 251, 0.4)'};
          top: 10%;
          left: 15%;
        }

        .circle2 {
          width: 200px;
          height: 200px;
          background: ${lightMode ? 'rgba(97, 218, 251, 0.5)' : 'rgba(97, 218, 251, 0.3)'};
          top: 50%;
          left: 60%;
        }

        .circle3 {
          width: 100px;
          height: 100px;
          background: ${lightMode ? 'rgba(97, 218, 251, 0.7)' : 'rgba(97, 218, 251, 0.5)'};
          top: 80%;
          left: 25%;
        }

        body {
          margin: 0;
          overflow: hidden;
          background-color: ${bgColor};
          transition: background-color 0.3s ease;
        }
      `}</style>
    </div>
  );
}