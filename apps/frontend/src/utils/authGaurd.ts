import type { APIContext } from 'astro';
import { TokenType } from '@/common/types.ts';
import jwt from 'jsonwebtoken';

let secretKey = import.meta.env.JWT_SECRET;

export function verifyToken(token: string) {
  if (token?.length === 0 || token === undefined) {
    return false;
  }
  return new Promise<TokenType>((resolve, reject) => {
    try {
      jwt.verify(token, secretKey, (err: Error, decoded: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded as TokenType);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

export const apiAuthGuard = async (
  request: APIContext['request'],
  roles: string[],
) => {
  let token = await request.headers.get('Authorization');

  if (!token) throw new Error('Unauthorized');
  token = token.split(' ')[1];
  let decoded = (await verifyToken(token)) as TokenType;
  if (!decoded || !roles.includes(decoded.role))
    throw new Error('Unauthorized');
  return decoded;
};

export const getUserDataFromToken = async (token: string) => {
  if (!token) return false;
  token = token.split(' ')[1];
  let decoded = (await verifyToken(token)) as TokenType;
  if (!decoded) return false;

  return decoded;
};
