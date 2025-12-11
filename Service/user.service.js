const db = require('../config/db');

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
};

// login

exports.getUserByEmail = async (email) => {
    try {
        const result = await db.query(
            `SELECT employee_id, name, company_id, designation, email, mobile, role, address, city, pincode, password
               
             FROM users WHERE email = $1;`
            [email]

        );
        console.log(result);


        return result.rows[0];
    } catch (err) {
        console.log(error);

        throw err;
    }
};

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

//Delete User
// exports.deleteUser = async (id) => {
//      try {
//           const result = await db.query(`DELETE FROM users WHERE employee_id=$1 RETURNING *`, [
//                id,
//           ]);

//           return result.rows;
//      } catch (error) {

//           throw error;

//      }
// };
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
