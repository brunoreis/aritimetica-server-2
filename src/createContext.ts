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

export const createContext = ({ req, res }: ContextInput ): Context => {
    // Get the JWT token from the request headers
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
  
    let userId: string | null = null;
  
    // Verify the JWT token and get the user id
    if (token) {
      try {
        const { id } = verify(token, JWT_SECRET_KEY) as { id: string };
        userId = id;
      } catch (err) {
        console.log(err);
      }
    }
    
    return {
      prisma,
      req,
      res,
      userId,
    };
};