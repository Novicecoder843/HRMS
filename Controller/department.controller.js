const departmentService = require("../Service/department.service");

// 1. Create Department
exports.createDepartment = async (req, res) => {
    try {
        const result = await departmentService.createDepartment(req.body);
        return res.status(201).json({
            success: true,
            message: "Department created successfully",
            data: result,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// 2. Get All Departments
exports.getAllDepartments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        const result = await departmentService.getAllDepartments(page, limit);

        return res.status(200).json({
            success: true,
            message: "Departments fetched successfully",
            data: result.departments,
            pagination: {
                page: page,
                limit: limit,
                totalPages: result.totalPages,
                totalRecords: result.totalRecords
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error while fetching departments"
        });
    }
};

// 3. Get Department by ID
exports.getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await departmentService.getDepartmentById(id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
                data: [],
            });
        }
        return res.status(200).json({
            success: true,
            message: "Department fetched successfully",
            data: result,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error while fetching department by ID"
        });
    }
};

// 4. Update Department
exports.updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await departmentService.updateDepartment(id, req.body);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Department not found or no fields provided for update.",
                data: [],
            });
        }
        return res.status(200).json({
            success: true,
            message: "Department updated successfully",
            data: result,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error while updating department",
            data: [],
        });
    }
};

// 5. Delete Department 
exports.deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const rowCount = await departmentService.deleteDepartment(id);

        if (rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Department deleted successfully",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error during delete",
        });
    }
};