declare namespace Express {
  interface Request {
    user?: {
      sub: string;
      username: string;
      role: string;
      iat: number;
      exp: number;
    };
  }
}
