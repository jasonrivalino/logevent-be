// src/middleware.ts

// dependency modules
import { rateLimit } from "express-rate-limit";
import { NextFunction, Request, Response } from "express";
// self-defined modules
import jwtUtils from "./utils/jwt";
import { CustomRequest } from "./utils/types";

class Middleware {
  async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Token not provided" });
      }

      const decoded = jwtUtils.verifyToken(authHeader);
      const customReq = req as CustomRequest;
      customReq.user = decoded;
      
      next();
    } catch (error: any) {
      return res.status(401).json({ message: error.message || "Invalid token" });
    }
  }

  visitRateLimit = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 1,
    message: 'You have already recorded a visit today',
    keyGenerator: (req: Request) => {
      const productId = req.body.productId;
      return `${req.ip}-${productId}`;
    }
  });
}

export default new Middleware();
