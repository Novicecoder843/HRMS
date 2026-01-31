const db = require('../config/db');
const bcrypt = require("bcrypt");



// Create user
exports.createUser = async (row, company_id, role_id, dept_id, hashPassword, emp_code) => {
     try {
          const query = `
      INSERT INTO users 
      (name, company_id, email, mobile, designation, role_id, address, city, pincode, password, status, emp_code, dept_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *;
    `;

          const values = [
               row.user_name,
               company_id,
               row.email,
               row.mobile,
               row.designation,
               role_id,
               row.address || "",
               row.city || "",
               row.pincode || null,
               hashPassword,
               "active",
               emp_code,
               dept_id
          ];

          const newUser = await db.query(query, values);
          return newUser.rows[0];

     } catch (err) {
          console.error(err);
          throw err;
     }
};

//upload data

exports.processExcelRow = async (row) => {

     // 1️⃣ Validate required fields
     if (!row.name || !row.email || !row.mobile || !row.company_id || !row.company_name) {
          throw new Error("Missing required fields");
     }

     // 2️⃣ Hash password
     const hashPassword = await bcrypt.hash(row.password || "Pass@123", 10);

     // 3️⃣ Insert directly into users table
     const result = await db.query(
          `INSERT INTO users (
        name,
        email,
        mobile,
        password,
        role,
        company_id,
        company_name,
        designation,
        status
     )
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
          [
               row.name,
               row.email,
               row.mobile,
               hashPassword,
               row.role || "employee",
               row.company_id,
               row.company_name,
               row.designation || "",
               
               "active"
          ]
     );

     return result.rows[0];
};

// login

exports.getUserByEmail = async (email) => {
     try {
          const result = await db.query(
               `SELECT employee_id, name, company_id,  email, mobile, role_id, address, city, pincode, password
       FROM users
       WHERE email = $1`,
               [email]
          );

          return result.rows[0]; // undefined if not found
     } catch (err) {
          console.log(err);
          throw err;
     }
};


// user.service.js mein query aisi honi chahiye:
exports.getAllUsersWithDetails = async () => {
     try {
          const query = `
               SELECT 
                    u.name AS name, 
                    u.email AS email, 
                    u.mobile AS mobile, 
                    COALESCE(dg.name, 'N/A') AS designation,   
                    COALESCE(c.name, 'N/A') AS company_name, 
                    COALESCE(d.name, 'N/A') AS department_name, 
                    COALESCE(r.role_name, 'No Role Assigned') AS role_name 
               FROM users u
               LEFT JOIN company c ON u.company_id = c.company_id
               LEFT JOIN department d ON u.department_id = d.department_id
               -- Yahan dhyan dein: r.role_id ki jagah r.id bhi ho sakta hai aapki table mein
               LEFT JOIN roles r ON u.role_id = r.role_id 
               LEFT JOIN designation dg ON u.designation_id = dg.designation_id
               WHERE u.status = 'active' OR u.status = 'true'
          `;
          const result = await db.query(query);
          console.log("Database Data:", result.rows); // Isse terminal mein keys check karein
          return result.rows;
     } catch (error) {
          throw error;
     }
};

// update password

exports.updateUserPassword = async (id, newHashedPassword) => {
     try {
          const result = await db.query(
               `UPDATE users 
       SET password = $1 
       WHERE employee_id = $2
       RETURNING *`,
               [newHashedPassword, id]
          );

          return result.rows[0];
     } catch (error) {
          console.log(error);
          
          throw error;
     
     }

};



//ReadUser

//raw 
exports.getAllUsers = async (limit, offset) => {
     try {
          const totalData = await db.query(`SELECT COUNT(*) FROM users`);
          const total = Number(totalData.rows[0].count);

          const result = await db.query(
               `SELECT * FROM users ORDER BY employee_id ASC LIMIT $1 OFFSET $2`,
               [limit, offset]
          );

          return {
               limit,
               total,
               totalPages: Math.ceil(total / limit),
               data: result.rows
          }

     } catch (error) {
          console.log(error);
          
          throw error
     }
}

    


//ReadUser By id

exports.getUserBYId = async (id) => {
     try {
          const result = await db.query(`SELECT * FROM users WHERE employee_id= $1`, [id]);
          console.log(result)
          return result.rows;

     } catch (error) {
          console.log(error);
          
          throw error
     }
};

// Update User

exports.updateUser = async (id, data) => {
     try {
          const result = await db.query(
               `Update users SET
               name=$1,
               company_id=$2,
               email=$3,
               mobile=$4,
               designation=$5,
               role=$6,
               address=$7,
               city=$8,
               pincode=$9
               where employee_id= $10
              RETURNING * `,
               [
                    data.name,
                    data.company_id,
                    data.email,
                    data.mobile,
                    data.designation,
                    data.role,
                    data.address,
                    data.city,
                    data.pincode,
                    id,
               ]
          );
          return result.rows;
     } catch (error) {

          console.log(error);

          throw error;
     }
};

//Delete user
exports.deleteUser = async (id) => {
     try {
          const result = await db.query(`DELETE FROM users WHERE employee_id=$1 RETURNING *`, [
               id,
          ]);
          
          return result.rows;
     } catch (error) {
          
          throw error;

     }
};

exports.softDeleteuser = async (id) => {
     try {
          const result = await db.query(
               `UPDATE user 
             SET status = false, deleted_At=NOW() 
             WHERE user_id = $1
             RETURNING *`,
               [id]
          );
          return result.rows;
     } catch (error) {
          console.log(error);
          
          throw error;
     }
};
