// lib/cors.ts
export function corsHeaders(origin: string | null) {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://found-monitor-delivers-enhance.trycloudflare.com",
  ]

  const allowOrigin =
    origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0]

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  }
}
