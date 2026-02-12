const Role = require('../models/role.model');

const roleService = {

    createRole: async (data) => {
        return await Role.create(data);
    },

    getRoleById: async (id) => {
        return await Role.findById(id);
    },

    getAllRoles: async () => {
        return await Role.findAll();
    },

    updateRole: async (id, data) => {
        return await Role.update(id, data);
    },

    deleteRole: async (id) => {
        return await Role.delete(id);
    }

};

module.exports = roleService;
