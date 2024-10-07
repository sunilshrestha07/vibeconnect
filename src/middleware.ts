import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const isPublicPath = pathname === '/login' || pathname === '/signup' || pathname === '/verify';

  const token = request.cookies.get("token")?.value || ''; // Fetch token from cookies

  if (token && isPublicPath) {
    // User is authenticated but trying to access a public path, redirect to home
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!token && !isPublicPath) {
    // User is not authenticated and trying to access a protected path, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next(); // Allow if no redirection is necessary
}

export const config = {
  matcher: [
    '/',           
    '/login',      
    '/signup',     
    '/verify',   
    '/search',
    '/create',
    '/reel',
    '/profile',
    '/notification',
    '/message',
  ],
};
