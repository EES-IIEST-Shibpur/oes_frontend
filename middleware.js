import { NextResponse } from 'next/server';

// Define protected routes
const protectedRoutes = [
  '/dashboard',
  '/exam',
  '/results',
  '/profile',
];

// Define public routes (no auth needed)
const publicRoutes = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/verify-otp',
  '/about',
  '/contact',
  '/faq',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if user has authentication cookie
  const hasAuthCookie = request.cookies.has('accessToken');
  
  // Check for auth flag in request headers (set by client)
  const hasAuthHeader = request.headers.get('x-auth-check') === '1';

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Allow root and public routes
  if (pathname === '/' || isPublicRoute) {
    // If user is already logged in and accessing login/signup, redirect to dashboard
    if (hasAuthCookie && (pathname === '/login' || pathname === '/signup')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protect routes that require authentication
  if (isProtectedRoute) {
    if (!hasAuthCookie) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
