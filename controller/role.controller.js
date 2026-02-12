const roleService = require('../services/role.service');

const roleController = {

    createRole: async (req, res) => {
        try {
            const role = await roleService.createRole(req.body);
            res.status(201).json({ message: 'Role created successfully', role });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    getRoleById: async (req, res) => {
        try {
            const role = await roleService.getRoleById(req.params.id);
            if (!role) return res.status(404).json({ error: 'Role not found' });
            res.status(200).json(role);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    getAllRoles: async (req, res) => {
        try {
            const roles = await roleService.getAllRoles();
            res.status(200).json(roles);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    updateRole: async (req, res) => {
        try {
            const role = await roleService.updateRole(req.params.id, req.body);
            res.status(200).json({ message: 'Role updated successfully', role });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    deleteRole: async (req, res) => {
        try {
            const role = await roleService.deleteRole(req.params.id);
            res.status(200).json({ message: 'Role deleted successfully', role });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

};


module.exports = roleController;
