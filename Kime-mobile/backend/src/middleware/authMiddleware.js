import jwt from 'jsonwebtoken';
import { AUTH_HEADER_KEY, BEARER_PREFIX } from '../const/auth.js';
import dotenv from "dotenv";
dotenv.config(); 

export const authMiddleware = (req, res, next) => {
    
    const authHeader = req.header(AUTH_HEADER_KEY);
  
    
    if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(400).json({ message: 'Invalid or expired token' });
    }
};

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }
      next();
    };
  };
  
  
