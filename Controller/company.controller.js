const { success, object } = require("zod");
const companyServices= require("../Service/company.service");
const { json } = require("body-parser");



//Create Copmany
exports.createCompany=async(req,res)=>{
    try {
        const result=await companyServices.createCompany(req.body);

        return res.status(201).json({
            success:true,
            message:"Company created successfully",
            data:result,
        })
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}

//Get Company
exports.getAllCompanies=async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result=await companyServices.getAllCompaniesService(page,limit);

        return res.status(200).json({
            success:true,
            message:"Companies fetched successfully",
            data:result.companies,
            pagination: {
                page: page,
                limit: limit,
                totalPages: result.totalPages,
                totalRecords: result.totalRecords
            }
        })
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success:false,
            message:"Server error while fetching companies"
        })
    }
}

//Get Company by id
exports.getCompanyById=async(req,res)=>{
    try {
        const {id}=req.params;
        const result=await companyServices.getCompanyByIDService(id);
        if(!result){
            return res.status(404).json({
                success:false,
                message:"Company not found or Inactive",
                data:[],
            })
        }
        return res.status(200).json({
            success:true,
            message:"company fetched successfully",
            data:result,
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"Server error while fetching company by ID"
        })
        
    }
}

//Update Company 
exports.updateCompany=async(req,res)=>{
    try {
        const {id}=req.params;
        const updateData=req.body;

        if(Object.keys(updateData).length===0){
            return res.status(400).json({
                success: false,
                message: "No fields provided for update.",
            })
        }

        const result=await companyServices.updateCompanyService(id,updateData);

        if(!result){
            return res.status(404).json({
                success: false,
                message: "Company not found or inactive",
                data: [],
            })
        }
        return res.status(200).json({
            success: true,
            message: "Company updated successfully",
            data: result,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error while updating company",
            data: [],
        });
    }
}

//Soft Delete
exports.softDeleteCompany = async (req, res) => {
    try {
        const { id } = req.params;

        const rowCount = await companyServices.softDeleteCompanyService(id);

        if (rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Company not found or already inactive",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Company  deleted successfully",
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error during soft delete",
        });
    }
};