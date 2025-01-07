import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  console.log(username);

  if (!username) {
    return new Response('Missing username', { status: 400 });
  }
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    }/api/${encodeURIComponent(username)}`,
  );
  if (!response.ok) {
    return new Response('Failed to fetch user', { status: 500 });
  }

  const user = (await response.json()) as {
    avatar: string;
    username: string;
    name: string;
    bio: string;
  };
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
          {/* Profile Picture */}
          <img
            src={user.avatar}
            width="120"
            height="120"
            style={{
              borderRadius: '60px',
              border: '4px solid #000000',
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontFamily: 'Geist-Bold',
                color: '#000000',
              }}
            >
              {user.name}
            </div>
            <div style={{ fontSize: 32, color: '#64748b' }}>
              @{user.username}
            </div>
          </div>

          <div style={{ fontSize: 40, color: '#0f172a', marginTop: '16px' }}>
            Ask me something!
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
