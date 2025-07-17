import { NextRequest, NextResponse } from 'next/server'
import { checkServerSession } from './lib/api/serverApi'
import { parse } from 'cookie'

const privateRoutes = ['/profile']

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl

  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route))

  if (isPrivateRoute && !accessToken) {
    if (refreshToken) {
      try {
        const response = await checkServerSession()

        const setCookie = response.headers['set-cookie']
        if (setCookie) {
          const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie]
          const newResponse = NextResponse.next()

          for (const newCookieStr of cookieArray) {
            const parsed = parse(newCookieStr)

            if (parsed.accessToken) {
              newResponse.cookies.set('accessToken', parsed.accessToken, {
                path: '/',
                httpOnly: true,
                secure: true,
                maxAge: Number(parsed['Max-Age']),
                expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              })
            }

            if (parsed.refreshToken) {
              newResponse.cookies.set('refreshToken', parsed.refreshToken, {
                path: '/',
                httpOnly: true,
                secure: true,
                maxAge: Number(parsed['Max-Age']),
                expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              })
            }
          }

          return newResponse
        }
      } catch (err) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
      }
    } else {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path*'], 
}
