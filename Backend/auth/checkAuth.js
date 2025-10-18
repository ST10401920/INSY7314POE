import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.status(401).json({message: "Authorization header missing"});

    const token = authHeader.split(" ")[1];
    if(!token) return res.status(401).json({message: "Token Missing"});

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch(err) {
        return res.status(403).json({message: "Invalid Token"});
    }
};

// https://medium.com/@ignatovich.dm/implementing-role-based-access-control-rbac-in-node-js-and-react-c3d89af6f945
export const authorizeRole = (allowedRoles) => (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res.status(403).json({ message: "Role not found" });
    }

    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
    }

    next();
};