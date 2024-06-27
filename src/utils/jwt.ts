import jwt, { Secret, JwtPayload } from 'jsonwebtoken';

class JwtUtil {
  private secret: Secret;

  constructor(secret?: Secret) {
    this.secret = secret || process.env.JWT_SECRET as Secret;
  }
  
  sign(payload: JwtPayload) {
    return jwt.sign(payload, this.secret);
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
}

export default new JwtUtil();
