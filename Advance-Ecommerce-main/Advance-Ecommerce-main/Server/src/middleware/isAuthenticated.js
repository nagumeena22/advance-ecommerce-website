import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // 👇 Use JWT_SECRET here to match the sign method
    const decoded = jwt.verify(token, 'your_jwt_secret_key');

    // Find the actual user from our shared storage
    const { findUserByEmail } = await import('../utils/userStorage.js');
    const user = findUserByEmail(decoded.email);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Return user data without password
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token. Please log in again." });
    } else {
      return res.status(401).json({ message: "Unauthorized access." });
    }
  }
};

export default isAuthenticated;
