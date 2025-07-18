import { NextRequest, NextResponse } from 'next/server'
import { checkServerSession } from './lib/api/serverApi'
import { parse } from 'cookie'

const privateRoutes = ['/profile', '/notes']
const publicRoutes = ['/sign-in', '/sign-up']

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  const isPrivateRoute = privateRoutes.some(r => pathname.startsWith(r))
  const isPublicRoute = publicRoutes.includes(pathname)

  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isPrivateRoute && !accessToken) {
    if (refreshToken) {
      try {
        const sessionRes = await checkServerSession()
        const setCookie = sessionRes.headers['set-cookie']
        if (setCookie) {
          const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie]
          const response = NextResponse.next()
          for (const c of cookieArray) {
            const p = parse(c)
            if (p.accessToken) {
              response.cookies.set('accessToken', p.accessToken, {
                httpOnly: true, secure: true, path: '/', 
                maxAge: Number(p['Max-Age']), expires: p.Expires ? new Date(p.Expires) : undefined
              })
            }
            if (p.refreshToken) {
              response.cookies.set('refreshToken', p.refreshToken, {
                httpOnly: true, secure: true, path: '/',
                maxAge: Number(p['Max-Age']), expires: p.Expires ? new Date(p.Expires) : undefined
              })
            }
          }
          return response
        }
      } catch {
        return NextResponse.redirect(new URL('/sign-in', request.url))
      }
    }
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
}
