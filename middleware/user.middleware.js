const User = require('../models/user.model');

const userIdAccessMiddleware = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id); // ID from route
    const loggedInUser = req.user; // user info attached by authMiddleware

    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    // Superadmin can access any user
    if (loggedInUser.role_name === 'superadmin') return next();

    // Fetch the target user from DB
    const targetUser = await User.findById(userId);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    // Company admin and HR can access users in their company
    if (
      (loggedInUser.role_name === 'company_admin' || loggedInUser.role_name === 'hr') &&
      loggedInUser.company_id === targetUser.company_id
    ) {
      return next();
    }

    // Employee can access only their own record
    if (loggedInUser.role_name === 'employee' && loggedInUser.id === targetUser.id) {
      return next();
    }

    // If none of the above, deny access
    return res.status(403).json({ message: 'Access denied' });
  } catch (error) {
    console.error('User access middleware error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = userIdAccessMiddleware;
