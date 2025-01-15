import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('u');

  if (!username) {
    return new Response('Missing username', { status: 400 });
  }

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
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '40px',
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderLeft: '4px solid #000000',
                borderTop: '4px solid #000000',
              }}
            />
            <div
              style={{
                width: 60,
                height: 60,
                borderRight: '4px solid #000000',
                borderTop: '4px solid #000000',
              }}
            />
          </div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <h1
              style={{
                fontSize: 48,
                fontWeight: 'bold',
              }}
            >
              Pergunte-me algo !
            </h1>
            <p
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#000000',
              }}
            >
              @{username}
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '40px',
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderLeft: '4px solid #000000',
                borderBottom: '4px solid #000000',
              }}
            />
            <div
              style={{
                width: 60,
                height: 60,
                borderRight: '4px solid #000000',
                borderBottom: '4px solid #000000',
              }}
            />
          </div>
        </div>
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
