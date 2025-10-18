export const authorizePermission = (requiredPermission) => (req, res, next) => {
    if (!req.user || !req.user.permissions) {
        return res.status(403).json({ message: "Permissions not found" });
    }

    if (!req.user.permissions.includes(requiredPermission)) {
        return res.status(403).json({ message: "Action not allowed" });
    }

    next();
};
