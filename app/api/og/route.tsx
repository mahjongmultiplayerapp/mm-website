import { ImageResponse } from 'next/og';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #071B18 0%, #0A2A20 50%, #061A14 100%)',
          padding: '60px',
          position: 'relative',
          fontFamily: 'Georgia, serif',
        } as React.CSSProperties}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 800px 400px at 50% 40%, rgba(31,138,98,.15), transparent 70%), radial-gradient(ellipse 600px 600px at 80% 20%, rgba(197,162,92,.08), transparent 70%)',
            pointerEvents: 'none',
          } as React.CSSProperties}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
            maxWidth: '900px',
          } as React.CSSProperties}
        >
          <div
            style={{
              position: 'relative',
              width: '200px',
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '10px',
            } as React.CSSProperties}
          >
            <div
              style={{
                position: 'absolute',
                width: '200px',
                height: '200px',
                border: '2px solid rgba(197,162,92,.25)',
                borderRadius: '50%',
                boxShadow: '0 0 0 1px rgba(197,162,92,.1), inset 0 0 60px rgba(197,162,92,.1)',
              } as React.CSSProperties}
            />

            <svg viewBox="0 0 200 200" width="180" height="180" style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,.5))' } as React.CSSProperties}>
              <rect width="200" height="200" rx="20" fill="#F5EEDD" />
              <rect width="200" height="200" rx="20" fill="url(#tileGradient)" />
              <defs>
                <linearGradient id="tileGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FDF8EA" />
                  <stop offset="100%" stopColor="#F0E6CF" />
                </linearGradient>
              </defs>
              <text x="100" y="120" fontSize="120" fontWeight="600" textAnchor="middle" fill="#1F8A62" fontFamily="Georgia, serif">
                茶
              </text>
            </svg>
          </div>

          <h1
            style={{
              fontSize: '72px',
              fontWeight: '500',
              letterSpacing: '-0.02em',
              color: '#F5EEDD',
              margin: 0,
              lineHeight: '1.1',
              fontFamily: 'Georgia, serif',
            } as React.CSSProperties}
          >
            Mahjong Multiplayer
          </h1>

          <p
            style={{
              fontSize: '28px',
              fontWeight: '400',
              color: '#E8DFC7',
              margin: 0,
              letterSpacing: '-0.01em',
              maxWidth: '700px',
              lineHeight: '1.4',
            } as React.CSSProperties}
          >
            Play Mahjong{' '}
            <span
              style={{
                color: '#C5A25C',
                fontStyle: 'italic',
                fontWeight: '300',
              }}
            >
              with friends,
            </span>{' '}
            online for free
          </p>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
