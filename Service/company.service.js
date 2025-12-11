const db = require('../config/db');

// create company

exports.createCompany = async (data) => {
     try {
          const result = await db.query(
               `INSERT INTO company(name,address,city,state,country,email,pincode) VALUES($1,$2,$3,$4,$5,$6,$7)  RETURNING *`,
               [
                    data.name,
                    data.address,
                    data.city,
                    data.state,
                    data.country,
                    data.email,
                    data.pincode || null,

               ]
          );
          return result.rows[0];
     } catch (error) {
          throw new Error(error)
     }
};

//Read Company

//raw query
exports.findAll = async () => {
     try {
          const result = await db.query(`SELECT * FROM company ORDER BY company_id DESC limit 8`);
          return result.rows;
     } catch (error) {
          throw error
     }
};

//ReadCompany By id

exports.getCompanyBYId = async (id) => {
     try {
          const result = await db.query(`SELECT * FROM company WHERE company_id= $1`, [id]);
          console.log(result)
          return result.rows;

     } catch (error) {
          throw error
     }
};

// Update Company

exports.updateCompany = async (id, data) => {
     try {
          const result = await db.query(
               `Update company SET
               name=$1,
               address=$2,
               city=$3,
               state=$4,
               country=$5,
               email=$6,
               pincode=$7
               
               where company_id= $8
              RETURNING * `,
               [
                    data.name,
                    data.address,
                    data.city,
                    data.state,
                    data.country,
                    data.email,
                    data.pincode,
                    id

               ]
          );
          return result.rows;
     } catch (error) {

          console.log(error);

          throw error;
     }
};

//Delete User
// exports.deleteCompany = async (id) => {
//      try {
//           const result = await db.query(`DELETE FROM company WHERE company_id=$1 RETURNING *`, [
//                id,
//           ]);

//           return result.rows;
//      } catch (error) {

//           throw error;

//      }
// };

// exports.hardDeleteCompany = async (id) => {
//      try {
//           const result = await db.query(
//                `DELETE FROM company 
//              WHERE company_id = $1 
//              RETURNING *`,
//                [id]
//           );
//           return result.rows;
//      } catch (error) {
//           throw error;
//      }
// };
exports.softDeleteCompany = async (id) => {
     try {
          const result = await db.query(
               `UPDATE company 
             SET status = false, deleted_At=NOW() 
             WHERE company_id = $1
             RETURNING *`,
               [id]
          );
          return result.rows;
     } catch (error) {
          throw error;
     }
};





