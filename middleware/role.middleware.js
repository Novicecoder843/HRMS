const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ error: 'Unauthorized. No role info found.' });
        }

        const userRole = req.user.role.toLowerCase();
        const normalizedRoles = allowedRoles.map(r => r.toLowerCase());

        if (!normalizedRoles.includes(userRole)) {
            return res.status(403).json({ error: 'Forbidden. You do not have access to this resource.' });
        }

        next();
    };
};

module.exports = roleMiddleware;
