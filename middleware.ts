import { NextRequest, NextResponse } from 'next/server'
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

  if (isPrivateRoute && !accessToken && refreshToken) {
    try {
      const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/session`, {
        method: 'GET',
        headers: {
          Cookie: `refreshToken=${refreshToken}`
        },
        credentials: 'include',
      })

      if (apiRes.ok) {
        const setCookie = apiRes.headers.get('set-cookie')
        const response = NextResponse.next()

        if (setCookie) {
          const parsedCookies = parse(setCookie)
          if (parsedCookies.accessToken) {
            response.cookies.set('accessToken', parsedCookies.accessToken, {
              httpOnly: true, secure: true, path: '/', maxAge: 60 * 60
            })
          }
          if (parsedCookies.refreshToken) {
            response.cookies.set('refreshToken', parsedCookies.refreshToken, {
              httpOnly: true, secure: true, path: '/', maxAge: 7 * 24 * 60 * 60
            })
          }
        }

        return response
      }
    } catch {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
}
