const roleService = require("../Service/role.service");

// 1. Create Role
exports.createRole = async (req, res) => {
    try {
        const result = await roleService.createRole(req.body);
        
        if (!result) {
             return res.status(400).json({
                success: false,
                message: "Role name already exists for this scope."
            });
        }
        
        return res.status(201).json({
            success: true,
            message: "Role created successfully",
            data: result,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// 2. Get All Roles
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await roleService.getAllRoles();
        return res.status(200).json({
            success: true,
            message: "Roles fetched successfully",
            data: roles,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error while fetching roles"
        });
    }
};

// 3. Get Role by ID
exports.getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await roleService.getRoleById(id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Role fetched successfully",
            data: result,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error while fetching role by ID"
        });
    }
};

// 4. Update Role Name
exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await roleService.updateRole(id, req.body);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Role not found or no fields provided for update.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Role updated successfully",
            data: result,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error while updating role",
        });
    }
};

// 5. Delete Role 
exports.deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const rowCount = await roleService.deleteRole(id);

        if (rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Role deleted successfully",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error during delete",
        });
    }
};