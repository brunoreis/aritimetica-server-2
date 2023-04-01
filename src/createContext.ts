import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET_KEY } from './env';

import { Context } from './types';

const prisma = new PrismaClient();
type ContextInput = {
  req: Request, 
  res: Response
}

export const createContext = async ({ req, res }: ContextInput ): Promise<Context> => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    let userData = undefined;
    
    if (token) {
      try {
        const { userId } = verify(token, JWT_SECRET_KEY) as { userId: string };
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if(user) {
          userData = {
            id: userId,
            role: user.role
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    
    return {
      prisma,
      req,
      res,
      userData
    };
};