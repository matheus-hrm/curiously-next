'use server'

import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string;

type JWTPayload = {
    sub: string;
    iat: number;
    exp: number;
};

export async function hashPassword(password: string) {
  try {
    return await hash(password, 10);
  } catch (e) {
    throw new Error('Failed to hash password ' + e);
  }
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
) : Promise<boolean> {
  try {
    return await compare(password, hashedPassword);
  } catch (e) {
    throw new Error('Failed to verify password ' + e);
  }
}

export async function createToken(payload: JWTPayload) {
  try {
    return await sign(payload, JWT_SECRET, { expiresIn: '7d' });
  } catch (e) {
    throw new Error('Failed to create token ' + e);
  }
}

export async function verifyToken(token: string) {
  try {
    return await verify(token, JWT_SECRET) as JWTPayload;
  } catch (e) {
    throw new Error('Failed to verify token ' + e);
  }
}