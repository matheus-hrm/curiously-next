import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './jwt';

const publicRoutes = [
  '/auth/signin',
  '/auth/signup',
  '/error',
  '/verify-request',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('next-auth.session-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  try {
    await verifyToken(token);
    return NextResponse.next();
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
