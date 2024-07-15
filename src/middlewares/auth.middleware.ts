import jwtUtils from "../utils/jwt";
import { CustomRequest } from "../utils/types";
import { Request, Response, NextFunction } from "express";

class AuthMiddleware {
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
}

export default new AuthMiddleware();
