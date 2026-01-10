

const companyService = require("../Service/company.service");

//Create company

exports.createCompany = async (req, res) => {
     try {
          const {
               name,
               address,
               city,
               state,
               country,
               email,
               pincode
          } = req.body
          
          const result = await companyService.createCompany({
               name,
               address,
               city,
               state,
               country,
               email,
               pincode,
          });
          res.status(200).json({
               success: true,
               message: "Company created succesfully",
               data: result || [],
          });

     } catch (error) {
          console.log(error);
          res.status(500).json({
               success: false,
               message: error.message,
               data: [],
          });
          return;
     };
};

// Read all-

exports.getAllCompany = async (req, res) => {
     try {
          const result = await companyService.findAll();
          res.status(200).json({
               success: true,
               data: result,
          });
     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message
          });
     }
};


//Read by ids


exports.getCompanyById = async (req, res) => {
     try {
          const { id } = req.params;
          const result = await companyService.getCompanyBYId(id);

          if (!result || result.length === 0) {
               return res.status(404).json({
                    success: false,
                    message: "user not found",
                    data: [],
               });
          }
          res.status(200).json({
               success: true,
               message: "Company Fetched Successfully",
               data: result,
          });
     } catch (error) {
          console.log(error)
          res.status(500).json({
               success: false,
               message: error.message,
               data: [],
          });
     }
};

// update user by id

exports.UpdateCompany = async (req, res) => {
     try {
          const { id } = req.params;
          const {
               name,
               address,
               city,
               state,
               country,
               email,
               pincode,
          } = req.body;

          const result = await companyService.updateCompany(id, {
               name,
               address,
               city,
               state,
               country,
               email,
               pincode,
          });

          if (!result || result.length === 0) {
               return res.status(400).json({
                    success: false,
                    message: "company not found",
                    data: result[0],
               });
          }

          return res.status(200).json({
               success: true,
               message: "company update sucessfully",
               data: [],
          });
     } catch (error) {
          return res.status(500).json({
               success: false,
               message: error.message,
               data: [],
          });
     }
};

//Delete user by Id

exports.deleteCompany = async (req, res) => {
     try {
          const { id } = req.params;
          const result = await companyService.deleteCompany(id);
          if (result.length === 0) {
               return res.status(404).json({
                    success: false,
                    message: "Company not found",
                    data: []
               })
          }
          return res.status(200).json({
               success: true,
               message: "Company deleted successfully",
               data: [],
          });
     } catch (error) {
          return res.status(500).json({
               success: false,
               message: error.message,
               data: [],
          });
     }
}


// exports.hardDeleteCompany = async (req, res) => {
//      try {
//           const { id } = req.params;
//           const result = await companyService.hardDeleteCompany(id);
//           if (result.length === 0) {
//                return res.status(404).json({
//                     success: false,
//                     message: "Company not found",
//                     data: []
//                })
//           }
//           return res.status(200).json({
//                success: true,
//                message: "Company deleted successfully",
//                data: [],
//           });
//      } catch (error) {
//           return res.status(500).json({
//                success: false,
//                message: error.message,
//                data: [],
//           });
//      }
// };


exports.softDeleteCompany = async (req, res) => {
     try {
          const { id } = req.params;
          const result = await companyService.softDeleteCompany(id);
          if (result.length === 0) {
               return res.status(404).json({
                    success: false,
                    message: "Company not found",
                    data: []
               })
          }
          return res.status(200).json({
               success: true,
               message: "Company deleted successfully",
               data: [],
          });
     } catch (error) {
          return res.status(500).json({
               success: false,
               message: error.message,
               data: [],
          });
     }
};


























