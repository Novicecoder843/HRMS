
const departmentService = require('../Service/department.service')



exports.createDepartment = async function(req,res){

    try{

        const {manager_id,dept_name,company_id} = req.body

        const modifyDeptname = dept_name + '_' +company_id
        //marketing_2

        const result = await departmentService.createDepartment({manager_id,modifyDeptname,company_id})

        res.status(200).json({
            success :true,
            message :"User created succefully",
            data : result || []
        })
        return


    }catch(error){
         res.status(500).json({
            success :false,
            message :error.message,
            data : []
        })
        return

    }

}


exports.getAllDepartment = async function(req,res){

    try{

        const {name,comapny_id,email,mobile,desgnation,password} = req.body

        const result = await userService.createUser({name,comapny_id,email,mobile,desgnation,password})

        res.status(200).json({
            success :true,
            message :"User created succefully",
            data : result || []
        })
        return


    }catch(error){
         res.status(500).json({
            success :false,
            message :error.message,
            data : []
        })
        return

    }

}