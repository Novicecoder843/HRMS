const departmentService = require("../Service/department.service");

// CREATE Department
exports.createDepartment = async (req, res) => {
     try {
          const { name, company_id } = req.body;

          const result = await departmentService.createDepartment({
               name,
               company_id,
          });

          res.status(200).json({
               success: true,
               message: "Department created successfully",
               data: result || [],
          });
     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message,
               data: [],
          });
     }
};

// READ ALL
exports.getAllDepartment = async (req, res) => {
     try {
          const result = await departmentService.findAll();
          res.status(200).json({
               success: true,
               data: result,
          });
     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message,
          });
     }
};

// READ BY ID
exports.getDepartmentById = async (req, res) => {
     try {
          const { id } = req.params;
          const result = await departmentService.getDepartmentById(id);

          if (!result || result.length === 0) {
               return res.status(404).json({
                    success: false,
                    message: "Department not found",
                    data: [],
               });
          }

          res.status(200).json({
               success: true,
               message: "Department fetched successfully",
               data: result,
          });
     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message,
               data: [],
          });
     }
};

// UPDATE
exports.updateDepartment = async (req, res) => {
     try {
          const { id } = req.params;
          const { name, company_id } = req.body;

          const result = await departmentService.updateDepartment(id, {
               name,
               company_id,
          });

          if (!result || result.length === 0) {
               return res.status(400).json({
                    success: false,
                    message: "Department not found",
                    data: [],
               });
          }

          res.status(200).json({
               success: true,
               message: "Department updated successfully",
               data: [],
          });
     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message,
               data: [],
          });
     }
};

// DELETE
exports.deleteDepartment = async (req, res) => {
     try {
          const { id } = req.params;
          const result = await departmentService.deleteDepartment(id);

          if (result.length === 0) {
               return res.status(404).json({
                    success: false,
                    message: "Department not found",
                    data: [],
               });
          }

          res.status(200).json({
               success: true,
               message: "Department deleted successfully",
               data: [],
          });
     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message,
               data: [],
          });
     }
};
