import jwt from 'jsonwebtoken';

export type User = {
  id: string;
  color: string;
};
const secretKey = process.env.SECRET_KEY || 'hello_world';

export const validateToken = (token: string): User => {
  return jwt.verify(token, secretKey) as User;
};

export const generateToken = (user: User) => {
  return jwt.sign(user, secretKey);
};
