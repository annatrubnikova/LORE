import jwt from 'jsonwebtoken';
import config from '../config.js'

const authenticateAdmin = (req, res, next) => {
  
  const token = req.header('Authorization').split(' ')[1] || req.query.token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token not provided.' });
  }
  try {
    
    const decodedToken = jwt.verify(token, config.key);

    
    if (decodedToken.role && decodedToken.role.includes('Admin')) {
      
      req.user = decodedToken; 
      next();
    } else {
      return res.status(403).json({ error: 'Forbidden - Insufficient privileges.' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token.' });
  }
};

export default authenticateAdmin;