import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n';
import { requireAuthForAdmin } from './lib/auth-middleware';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip login page from auth check
  const isLoginPage = pathname.includes('/login');
  
  // Check if path is an admin route
  const isAdminRoute = pathname.includes('/admin');

  // Protect admin routes (but not login)
  if (isAdminRoute && !isLoginPage) {
    const authResponse = await requireAuthForAdmin(request);
    if (authResponse) {
      return authResponse;
    }
  }

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Redirect if there is no locale (skip login page)
  if (!pathnameHasLocale && !isLoginPage) {
    const locale = defaultLocale;
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico|.*\\..*|.*svg|.*png|.*jpg|.*jpeg).*)',
  ],
};

