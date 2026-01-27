const db = require('../config/db');
const bcrypt = require("bcrypt");



// Create user
exports.createUser = async (data) => {
     try {
          const result = await db.query(
               `INSERT INTO users (name,company_id,email,mobile,designation,role,address,city,pincode,password) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
               [
                    data.name,
                    data.company_id,
                    data.email,
                    data.mobile,
                    data.designation,
                    data.role,
                    data.address,
                    data.city,
                    data.pincode || null,
                    data.password
               ]
          );

          return result.rows[0];
     } catch (error) {
          console.log(error);
          
          throw new Error(error);
     }
}



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
               `SELECT employee_id, name, company_id, designation, email, mobile, role, address, city, pincode, password
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
exports.getAllUsersWithDetails = async () => {
     try {
          const query = `SELECT
    u.name as user_name,
    u.email,
    u.mobile,
    u.designation,
    u.emp_code,
    c.name as company_name,
    d.name as department_name,
                r.role_name
            FROM users u
            LEFT JOIN companies c ON u.company_id = c.company_id
            LEFT JOIN departments d ON u.dept_id = d.id
            LEFT JOIN roles r ON u.role_id = r.id
            WHERE u.status = 'active'
            ORDER BY u.id DESC;
    `;
          const result = await db.query(query);
          return result.rows;
     } catch (err) {
          console.error(err);
          throw new Error("Error fetching detailed users: " + err.message);
     }
};
@ -147, 25 + 144, 52 @@ const emp_code = `${prefix}${String(seq).padStart(4, "0")}`;
`INSERT INTO users (name, company_id, email, mobile, designation, role_id, address, city, pincode, password, status, emp_code, dept_id) 
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
     [
          row.user_name,
          company_id,
          row.email,
          row.mobile,
          row.designation,
          role_id,
          row.address || '',
          row.city || '',
          row.pincode || null,
          hashPassword,
          "active",
          emp_code,
          dept_id,
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
          dept_id,
     ]
  );

return newUser.rows[0];
};

//Download user data
exports.getAllUsersWithDetails = async () => {
     try {
          const query = `SELECT
    u.name as user_name,
    u.email,
    u.mobile,
    u.designation,
    u.emp_code,
    c.name as company_name,
    d.name as department_name,
                r.role_name
            FROM users u
            LEFT JOIN companies c ON u.company_id = c.company_id
            LEFT JOIN departments d ON u.dept_id = d.id
            LEFT JOIN roles r ON u.role_id = r.id
            WHERE u.status = 'active'
            ORDER BY u.id DESC;
    `;
          const result = await db.query(query);
          return result.rows;
     } catch (err) {
          console.error(err)
          throw new Error("Error fetching detailed users: " + err.message)
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
