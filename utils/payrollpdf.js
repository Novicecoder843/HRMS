const PDFDocument = require("pdfkit");

const generatePayrollPDF = (res, payrollData) => {

     const doc = new PDFDocument({ margin: 50 });

     res.setHeader("Content-Type", "application/pdf");
     res.setHeader(
          "Content-Disposition",
          `attachment; filename=salary-slip-${payrollData.employee_id}.pdf`
     );

     doc.pipe(res);

     // 🔹 Title
     doc
          .fontSize(22)
          .text("HRMS Salary Slip", { align: "center" })
          .moveDown(2);

     // 🔹 Employee Details
     doc
          .fontSize(14)
          .text(`Employee Name : ${payrollData.employee_name}`)
          .text(`Employee ID   : ${payrollData.employee_id}`)
          .text(`Present Days  : ${payrollData.present_days}`)
          .text(`Total Hours   : ${payrollData.total_hours}`)
          .moveDown(2);

     // 🔹 Earnings Section
     doc
          .fontSize(16)
          .text("Earnings", { underline: true })
          .moveDown();

     doc
          .fontSize(14)
          .text(`Basic Salary : ₹${Number(payrollData.basic_salary).toFixed(2)}`)
          .text(`Allowances   : ₹${Number(payrollData.allowances).toFixed(2)}`)
          .moveDown();

     // 🔹 Deductions Section
     doc
          .fontSize(16)
          .text("Deductions", { underline: true })
          .moveDown();

     doc
          .fontSize(14)
          .text(`Deductions   : ₹${Number(payrollData.deductions).toFixed(2)}`)
          .moveDown(2);

     // 🔹 Net Salary
     doc
          .fontSize(18)
          .text(
               `Net Salary : ₹${Number(payrollData.final_salary).toFixed(2)}`,
               { align: "right" }
          )
          .moveDown(3);

     // 🔹 Footer
     doc
          .fontSize(10)
          .text("This is a system-generated salary slip.", { align: "center" });

     doc.end();
};

module.exports = generatePayrollPDF;
