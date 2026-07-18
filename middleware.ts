import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { deriveAdminToken } from '@/lib/admin-token';

// Optional: Demo site protection
// Set DEMO_PASSWORD in your environment to enable password protection
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin protection ──────────────────────────────────────────────────────
  // Protect /admin and /api/admin/* (except /api/admin/auth which handles login)
  const isAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  const isAuthEndpoint = pathname === '/api/admin/auth';

  if (isAdminPath && !isAuthEndpoint) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return new NextResponse('Admin not configured.', { status: 503 });
    }
    const adminCookie = request.cookies.get('admin-auth');
    const expectedToken = await deriveAdminToken(adminPassword);
    if (adminCookie?.value !== expectedToken) {
      // API calls get 401, page visits get redirect to login
      if (pathname.startsWith('/api/admin')) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }
  // ─────────────────────────────────────────────────────────────────────────

  const demoPassword = process.env.DEMO_PASSWORD;
  
  // If no demo password is set, allow all traffic
  if (!demoPassword) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  const authCookie = request.cookies.get('demo-auth');
  
  // Allow access if authenticated
  if (authCookie?.value === demoPassword) {
    return NextResponse.next();
  }

  // Check for auth query parameter
  const password = request.nextUrl.searchParams.get('auth');
  
  if (password === demoPassword) {
    // Set auth cookie and redirect to clean URL
    const response = NextResponse.redirect(new URL(request.nextUrl.pathname, request.url));
    response.cookies.set('demo-auth', demoPassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  }

  // Show simple auth page
  return new NextResponse(
    `<!DOCTYPE html>
<html>
<head>
  <title>Demo Access</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .auth-box {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      max-width: 400px;
      width: 90%;
    }
    h1 {
      margin: 0 0 0.5rem;
      color: #333;
      font-size: 1.8rem;
    }
    p {
      color: #666;
      margin: 0 0 1.5rem;
      font-size: 0.95rem;
    }
    form {
      display: flex;
      gap: 0.5rem;
      flex-direction: column;
    }
    input {
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }
    input:focus {
      outline: none;
      border-color: #667eea;
    }
    button {
      padding: 0.75rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }
    button:hover {
      transform: translateY(-2px);
    }
    button:active {
      transform: translateY(0);
    }
    .footer {
      margin-top: 1rem;
      text-align: center;
      font-size: 0.85rem;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="auth-box">
    <h1>Demo Access</h1>
    <p>This is a private demo. Please enter the access code to continue.</p>
    <form method="GET">
      <input 
        type="password" 
        name="auth" 
        placeholder="Enter access code"
        autocomplete="off"
        required
        autofocus
      />
      <button type="submit">Access Demo</button>
    </form>
    <div class="footer">
      Trust Quality Design
    </div>
  </div>
</body>
</html>`,
    {
      status: 401,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-store',
      },
    }
  );
}

// Configure which routes to protect
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/health (health checks)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt
     * - images/ (public images)
     */
    '/((?!api/health|api/admin/auth|_next/static|_next/image|favicon.ico|robots.txt|images).*)',
  ],
};
