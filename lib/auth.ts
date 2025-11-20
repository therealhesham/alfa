import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from './jwt';
import { cookies } from 'next/headers';

export async function getAuthUser(request?: Request) {
  let token: string | null = null;

  if (request) {
    // Try to get token from Authorization header
    token = getTokenFromRequest(request);
  }

  // If no token in header, try to get from cookies
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get('auth-token')?.value || null;
  }

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  return payload;
}

export function requireAuth(handler: (request: NextRequest, user: any) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return handler(request, user);
  };
}

