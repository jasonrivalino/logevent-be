import jwt, { Secret, JwtPayload } from 'jsonwebtoken';

class JwtUtils {
  private secret: Secret;

  constructor(secret?: Secret) {
    this.secret = secret || (process.env.JWT_SECRET as Secret);
  }

  sign(payload: JwtPayload) {
    return jwt.sign(payload, this.secret, { expiresIn: '1h' });
  }

  verify(token: string) {
    return jwt.verify(token, this.secret);
  }

  decode(token: string) {
    return jwt.decode(token);
  }

  refresh(token: string) {
    const payload = this.verify(token) as JwtPayload;
    return this.sign(payload);
  }

  extractToken(authHeader: string) {
    if (!authHeader) {
      throw new Error('Token not provided');
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new Error('Invalid token format');
    }

    return parts[1];
  }

  verifyToken(authHeader: string) {
    const token = this.extractToken(authHeader);
    return this.verify(token);
  }
}

export default new JwtUtils();
