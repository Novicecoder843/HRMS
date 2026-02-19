const payrollService = require("../Service/payroll.service");

const { generatePayrollPDF } = require("../utils/payrollpdf");

const { generatePayroll } = require("../Service/payroll.service");

/**
 * Create Payroll
 */
exports.createPayroll = async (req, res) => {
     try {
          const payroll = await payrollService.createPayroll(req.body);
          res.status(201).json({
               success: true,
               data: payroll
          });
     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message
          });
     }
};


/**
 * Get All Payroll
 */
exports.getAllPayroll = async (req, res) => {
     try {
          const data = await payrollService.getAllPayroll();
          res.status(200).json({
               success: true,
               data: data
          });
     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message 
          });
     }
};

/**
 * Get Payroll By ID
 */
exports.getPayrollById = async (req, res) => {
     try {
          const payroll = await payrollService.getPayrollById(req.params.id);

          if (!payroll) {
               return res.status(404).json({ message: "Payroll not found" });
          }

          res.json({
               success: true,
               data: payroll
          });

     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message
          });
     }
};



 //update payroll


exports.updatePayroll = async (req, res) => {
     try {
          const { id } = req.params;

          // This must match the name in the Service file exactly
          const result = await payrollService.updatePayrollRecord(id, req.body);

          if (!result) {
               return res.status(404).json({ success: false, message: "Payroll record not found" });
          }

          res.status(200).json({ success: true, data: result });
     } catch (error) {
          res.status(500).json({ success: false, message: error.message });
     }
};

/**
 * Delete Payroll
 */
exports.deletePayroll = async (req, res) => {
     try {
          const id = Number(req.params.id);

          const result = await payrollService.deletePayrollRecord(id);

          if (!result) {
               return res.status(404).json({
                    success: false,
                    message: "Payroll record not found"
               });
          }

          res.status(200).json({
               success: true,
               message: "Payroll deleted successfully",
               data: result
          });

     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message
          });
     }
};



// 3. Define and Export the Controller




exports.generateSalarySlip = async (req, res) => {
     try {
          const employeeId = Number(req.params.id);
          const { month, year } = req.query;

          if (!month || !year) {
               return res.status(400).json({
                    success: false,
                    message: "Month and Year are required in query params"
               });
          }

          // Service se formatted data lena
          const payrollData = await generatePayroll(employeeId, month, year);

          // PDF generate karke response bhejna
          generatePayrollPDF(res, payrollData);

     } catch (error) {
          console.error("Salary Slip Error:", error);
          res.status(500).json({
               success: false,
               error: error.message
          });
     }
};

