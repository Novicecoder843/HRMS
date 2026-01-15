const designationService = require("../Service/designation.service1");


// CREATE
exports.createDesignation = async (req, res) => {
     try {
          const { name, department_id } = req.body;

          const result = await designationService.createDesignation({
               name,
               department_id,
          });

          res.status(200).json({
               success: true,
               message: "Designation created successfully",
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

// READ ALL
exports.getAllDesignation = async (req, res) => {
     try {
          const result = await designationService.findAll();
          res.json({
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
exports.getDesignationById = async (req, res) => {
     try {
          const { id } = req.params;

          const result = await designationService.getDesignationById(id);

          if (result.length === 0) {
               return res.status(404).json({
                    success: false,
                    message: "Designation not found",
                    data: [],
               });
          }

          res.json({
               success: true,
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
exports.updateDesignation = async (req, res) => {
     try {
          const { id } = req.params;
          const { name, department_id } = req.body;

          const result = await designationService.updateDesignation(id, {
               name,
               department_id,
          });

          if (result.length === 0) {
               return res.status(404).json({
                    success: false,
                    message: "Designation not found",
                    data: [],
               });
          }

          res.json({
               success: true,
               message: "Designation updated successfully",
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

// DELETE
exports.deleteDesignation = async (req, res) => {
     try {
          const { id } = req.params;

          const result = await designationService.deleteDesignation(id);

          if (result.length === 0) {
               return res.status(404).json({
                    success: false,
                    message: "Designation not found",
                    data: [],
               });
          }

          res.json({
               success: true,
               message: "Designation deleted successfully",
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
