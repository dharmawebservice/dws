import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dws-fallback-secret-change-in-production-32ch'
);

export async function createToken() {
  return await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(SECRET);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('dws_admin')?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch (err) {
    console.error('Session error:', err);
    return null;
  }
}