const PDFDocument = require("pdfkit");

exports.generatePayrollPDF = (res, data) => {
     const doc = new PDFDocument({ margin: 50 });

     // Response header set karna taaki browser ise PDF ki tarah download kare
     res.setHeader("Content-Type", "application/pdf");
     res.setHeader("Content-Disposition", `attachment; filename=SalarySlip_${data.employee_id}.pdf`);

     doc.pipe(res);

     // --- Header: Company Name ---
     doc.fontSize(18).text(data.company_name, { align: "center", bold: true });
     doc.fontSize(10).text(data.company_address, { align: "center" });
     doc.moveDown();
     doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
     doc.moveDown();

     // --- Title and Period (Right Aligned) ---
     doc.fontSize(14).text("SALARY SLIP", { continued: true });
     doc.fontSize(12).text(`Period: ${data.period_header}`, { align: "right" });
     doc.moveDown();

     // --- Employee Info Section (Grid Layout) ---
     doc.fontSize(10);
     doc.text(`Employee Name: ${data.employee_name}`, 50, doc.y);
     doc.text(`Date of Joining: ${data.joining_date}`, 350, doc.y - 12); // Right aligned manually

     doc.text(`Employee ID: ${data.employee_id}`, 50, doc.y + 5);
     doc.text(`Designation: ${data.designation}`, 350, doc.y - 12);

     doc.text(`Role: ${data.role}`, 50, doc.y + 5);
     doc.moveDown(2);

     // --- Table Header ---
     const tableTop = doc.y;
     doc.rect(50, tableTop, 500, 20).fill("#f0f0f0").stroke();
     doc.fillColor("#000").text("Earnings", 60, tableTop + 5);
     doc.text("Amount", 250, tableTop + 5);
     doc.text("Deductions", 310, tableTop + 5);
     doc.text("Amount", 500, tableTop + 5);

     // --- Table Content ---
     let currentY = tableTop + 25;

     // Row 1: Basic vs Deductions
     doc.text("Basic Salary", 60, currentY);
     doc.text(data.basic_salary, 250, currentY);
     doc.text("Total Deductions", 310, currentY);
     doc.text(data.deductions, 500, currentY);

     // Row 2: Allowances
     currentY += 20;
     doc.text("Allowances", 60, currentY);
     doc.text(data.allowances, 250, currentY);

     // --- Footer Table (Totals) ---
     currentY += 40;
     doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
     currentY += 10;
     doc.fontSize(11).font("Helvetica-Bold");
     doc.text(`Total Earnings: Rs. ${data.total_earnings}`, 60, currentY);
     doc.text(`Net Payable: Rs. ${data.final_salary}`, 310, currentY);

     // --- Final Signature Line ---
     doc.moveDown(4);
     doc.fontSize(10).font("Helvetica").text("This is a computer-generated document and does not require a signature.", { align: "center", italic: true });

     doc.end();
};