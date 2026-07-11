import { SignJWT, jwtVerify } from 'jose'

const getSecret = (secret: string) => new TextEncoder().encode(secret)

export async function signAccessToken(payload: Record<string, unknown>, secret: string) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(getSecret(secret))
}

export async function signRefreshToken(payload: Record<string, unknown>, secret: string) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret(secret))
}

export async function verifyToken(token: string, secret: string) {
  const { payload } = await jwtVerify(token, getSecret(secret))
  return payload
}
