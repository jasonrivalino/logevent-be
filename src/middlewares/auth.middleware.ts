import jwtUtil from "../utils/jwt";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  user?: any;
}

class AuthMiddleware {
  async authenticate(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    try {
      const decoded = jwtUtil.verify(token);

      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }
}

export default new AuthMiddleware();
