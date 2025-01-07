import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const question = searchParams.get('q');

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            width: 60,
            height: 60,
            borderLeft: '4px solid #000000',
            borderTop: '4px solid #000000',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 40,
            right: 40,
            width: 60,
            height: 60,
            borderRight: '4px solid #000000',
            borderTop: '4px solid #000000',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 40,
            width: 60,
            height: 60,
            borderLeft: '4px solid #000000',
            borderBottom: '4px solid #000000',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 40,
            width: 60,
            height: 60,
            borderRight: '4px solid #000000',
            borderBottom: '4px solid #000000',
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
            maxWidth: '900px',
          }}
        >
          {/* Username */}
          <div
            style={{
              fontSize: 32,
              fontFamily: 'Geist-Bold',
              color: '#000000',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>

          {/* Question */}
          <div
            style={{
              fontSize: 52,
              color: '#0f172a',
              textAlign: 'center',
              lineHeight: 1.4,
              maxWidth: '800px',
            }}
          >
            {question}
          </div>
        </div>

        {/* Branding */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#64748b',
            fontSize: 24,
            fontFamily: 'Geist-Bold',
          }}
        >
          curiously
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
