import * as crypto from 'crypto';

export function saltAndHashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

export function verifyPassword(password: string, hash: string, salt: string) {
    const hashToVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hashToVerify === hash;
}

export function generateToken() {
  return crypto.randomBytes(64).toString('hex');
}

export function generateRandomString(length: number) {
  return crypto.randomBytes(length).toString('hex');
}
