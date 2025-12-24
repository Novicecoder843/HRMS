const db = require("../config/db");

//Create company
exports.createCompany = async (data) => {
  const { name, email, mobile, address, city, pincode } = data;

  const query = `
    INSERT INTO companies (name, email, mobile, address, city, pincode)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [name, email, mobile, address, city, pincode];

  const result = await db.query(query, values);
  
  return result.rows[0];
};

//Get All Company
exports.getAllCompaniesService = async (page,limit) => {
    try {
        const offset = (page - 1) * limit;
    const countQuery = `SELECT COUNT(*) FROM companies WHERE status = 'active'`;
        const totalResult = await db.query(countQuery);
        const totalRecords = parseInt(totalResult.rows[0].count);
        const totalPages = Math.ceil(totalRecords / limit);
const companiesQuery=`
            SELECT company_id, name, email, mobile, address, city, pincode 
            FROM companies 
             WHERE status = 'active'
            ORDER BY company_id ASC
            LIMIT $1 OFFSET $2`; 
const result=await db.query(companiesQuery, [limit, offset]);
  return {
            companies: result.rows,
            totalRecords: totalRecords,
            totalPages: totalPages
        };
    } catch (err) {
        console.error(err);
        
        throw err;
    }
    
    
};

//Get Company by Id
exports.getCompanyByIDService = async (id) => {
  try {
    const query = `SELECT company_id, name, email, mobile, address, city, pincode 
 FROM companies 
 WHERE company_id = $1 AND status = 'active'`;
    const result = await db.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

exports.getCompanyById = exports.getCompanyByIDService;

//update company
exports.updateCompanyService=async(id,data)=>{

  try {
    const fields=[];
    const values=[];
    let paramIndex=1;

    for(const key in data){
        if(data[key]!==undefined && data [key]!==null){
            fields.push(`${key}=$${paramIndex}`);
            values.push(data[key])
            paramIndex++;
        }
    }

    if(fields.length === 0) {
            return null; 
        }

        fields.push(`updated_at=NOW()`);

        const idParamIndex=paramIndex;
        values.push(id);
        const query = `
            UPDATE companies 
            SET ${fields.join(', ')} 
            WHERE company_id = $${idParamIndex} AND status = 'active'
            RETURNING company_id, name, email, mobile, address, city, pincode;
        `;
        
        const result = await db.query(query, values);
        return result.rows[0];
    
  } catch (err) {
    console.error(err);
    
    throw err;
  }
    
}


//soft delete
exports.softDeleteCompanyService = async (id) => {
    try {
        const result = await db.query(
            `UPDATE companies
             SET status = 'inactive', deleted_at = NOW()
             WHERE company_id = $1 AND status = 'active'
             RETURNING company_id`,
            [id]
        );
        
    
        return result.rowCount; 
    } catch (err) {
        throw err;
    }
};

