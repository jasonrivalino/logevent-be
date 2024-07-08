import jwtUtils from "../utils/jwt";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  user?: any;
}

class AuthMiddleware {
  async authenticate(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ message: "Token not provided" });
      }

      const decoded = jwtUtils.verifyToken(authHeader);

      req.user = decoded;

      next();
    } catch (error: any) {
      return res.status(401).json({ message: error.message || "Invalid token" });
    }
  }
}

export default new AuthMiddleware();
