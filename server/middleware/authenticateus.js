import jwt from 'jsonwebtoken';
import config from '../config.js'


const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization').split(' ')[1] || req.query.token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token not provided.' });
  }
  try {
    
    const decodedToken = jwt.verify(token, config.key);
      
      req.user = decodedToken; 
      next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token.' });
  }
};

export default authenticateUser;