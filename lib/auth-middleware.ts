import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import type { JWTPayload } from './jwt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key-here';
const encoder = new TextEncoder();
const secretKey = encoder.encode(JWT_SECRET);

async function verifyTokenEdge(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error('❌ Edge token verification failed:', (error as Error).message);
    return null;
  }
}

export async function checkAuth(
  request: NextRequest
): Promise<{ user: any; isAuthenticated: boolean }> {
  // Debug: Log all cookies
  const allCookies = request.cookies.getAll();
  if (process.env.NODE_ENV === 'development') {
    console.log('🍪 All cookies:', allCookies.map(c => c.name));
    console.log('🍪 Request URL:', request.nextUrl.pathname);
  }
  
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    console.warn('❌ No auth token found in cookies');
    if (process.env.NODE_ENV === 'development') {
      console.log('🍪 Available cookies:', allCookies);
      console.log('🍪 Cookie header:', request.headers.get('cookie'));
    }
    return { user: null, isAuthenticated: false };
  }

  const payload = await verifyTokenEdge(token);

  if (!payload) {
    return { user: null, isAuthenticated: false };
  }

  return { user: payload, isAuthenticated: true };
}

export async function requireAuthForAdmin(
  request: NextRequest
): Promise<NextResponse | null> {
  const { isAuthenticated } = await checkAuth(request);

  if (!isAuthenticated) {
    const pathname = request.nextUrl.pathname;
    const locale = pathname.split('/')[1] === 'en' ? 'en' : 'ar';
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return null;
}

