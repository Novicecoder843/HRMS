const db = require("../config/db");

exports.createShift = async (data) => {
  const { company_id, shift_name, start_time, end_time, grace_period } = data;
  const query = `
    INSERT INTO shifts (company_id,shift_name,start_time,end_time,grace_period) VALUES ($1,$2,$3,$4,$5) RETURNING *;
    `;

    const result=await db.query(query,[company_id,shift_name,start_time,end_time,grace_period]);
    return result.rows[0];

};


exports.getShiftByCompany=async(company_id)=>{
    const query=`SELECT * FROM shifts WHERE company_id=$1`;
    const result = await db.query(query[company_id]);
    return result.rows;
}
