import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  
  // For VPS: Check if we're behind a proxy (HTTPS) or direct HTTP
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const isHttps = forwardedProto === 'https' || request.url.startsWith('https://');
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Allow override via environment variable for VPS setups
  const forceSecure = process.env.FORCE_SECURE_COOKIES === 'true';
  const useSecure = forceSecure || (isProduction && isHttps);
  
  // Clear auth token cookie with same options as login
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: useSecure,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}

