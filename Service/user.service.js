const { number } = require("zod");
const db = require("../config/db");

//Create User
exports.createUser = async (data) => {
  try {
    const result = await db.query(
      `INSERT INTO users (name,company_id,email,mobile,designation,role_id,address,city,pincode,password,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        data.name,
        data.company_id,
        data.email,
        data.mobile,
        data.designation,
        data.role_id,
        data.address,
        data.city,
        data.pincode || null,
        data.password,
        "active",
      ]
    );

    return result.rows[0];
  } catch (error) {
    return error;
  }
};

//
exports.getUserByMobile = async (mobile) => {
  try {
    const result = await db.query(`SELECT * FROM users WHERE mobile=$1`, [
      mobile,
    ]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

//ReadUser by pagination

exports.getAllUsers = async (page, limit,companyId) => {
  try {
    page = Number(page);
    limit = Number(limit);

    const offset = (page - 1) * limit;

    let whereConditions = `u.status='active'`;
    let mainQueryParams = [limit, offset];
    let countQueryParams = [];
    let paramIndex = 3;

    if (companyId) {
      whereConditions += " AND u.company_id=$" + paramIndex;
      mainQueryParams.push(companyId);
      countQueryParams.push(companyId);
      paramIndex++;
    }

    const countQuery =  `SELECT COUNT(*) FROM users u WHERE ${whereConditions.replace("u.company_id=$3", "u.company_id=$1")}`;
    const totalData = await db.query(countQuery, countQueryParams);
    const total = Number(totalData.rows[0].count);

    const mainQuery = `SELECT
    u.id,
    u.name AS user_name, 
 u.email, 
 u.mobile, 
 u.designation, 
 u.address, 
u.city AS user_city,
u.role_id,
r.role_name AS user_role_name,
u.company_id,
 c.name AS user_company_name, 
 u.created_at
FROM users u
LEFT JOIN roles r ON u.role_id = r.id 
LEFT JOIN companies c ON u.company_id = c.company_id 
WHERE ${whereConditions}
ORDER BY u.id DESC
LIMIT $1 OFFSET $2`;
    const result = await db.query(mainQuery, mainQueryParams);

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: result.rows,
    };
  } catch (error) {
    throw error;
  }
};

//ReadUser by id
exports.getUserById = async (id) => {
  try {
    const result = await db.query(
      `SELECT * FROM users WHERE id= $1 AND status='active'`,
      [id]
    );
    return result.rows;
  } catch (error) {
    return error;
  }
};

// Update User
exports.updateUser = async (id, data) => {
  try {
    const result = await db.query(
      `UPDATE users SET
        name=$1,
        company_id=$2,
        email=$3,
        mobile=$4,
        designation=$5,
        role_id=$6,
        address=$7,
        city=$8,
        pincode=$9,
        updated_at=NOW()
      WHERE id=$10
      RETURNING *`,
      [
        data.name,
        data.company_id,
        data.email,
        data.mobile,
        data.designation,
        data.role_id,
        data.address,
        data.city,
        data.pincode,
        id,
      ]
    );

    return result.rows;
  } catch (error) {
    throw error;
  }
};

//Delete User
exports.deleteUser = async (id) => {
  try {
    const result = await db.query(`DELETE FROM users WHERE id=$1 RETURNING *`, [
      id,
    ]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

//Bulk user insert
exports.bulkInsertUsers = async (users) => {
  if (!users || users.length === 0) {
    throw new Error("Users array is empty");
  }
  const columns = [
    "name",
    "company_id",
    "email",
    "mobile",
    "designation",
    "role_id",
    "address",
    "city",
    "pincode",
  ];
  const values = [];
  const rowPlaceholders = users.map((u, rowIndex) => {
    const startIndex = rowIndex * columns.length; // 0-based

    values.push(
      u.name || null,
      u.company_id || null,
      u.email || null,
      u.mobile || null,
      u.designation || null,
      u.role_id || null,
      u.address || null,
      u.city || null,
      u.pincode || null
    );

    const placeholders = [];
    for (let i = 1; i <= columns.length; i++) {
      placeholders.push(`$${startIndex + i}`);
    }
    return `(${placeholders.join(", ")})`;
  });

  const query = `
    INSERT INTO users (${columns.join(", ")})
    VALUES ${rowPlaceholders.join(", ")}
    RETURNING id
  `;

  // Use transaction (begin/commit) for safety
  const client = await db.pgConnection.connect();
  try {
    await client.query("BEGIN");
    const res = await client.query(query, values);
    await client.query("COMMIT");
    // res.rowCount gives number of rows returned by RETURNING (should match users.length)
    return { rowCount: res.rowCount, rows: res.rows };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

//login
exports.getUserByEmail = async (email) => {
  try {
    const result = await db.query(
      `SELECT id, name, email, mobile, role_id, address, city, pincode, password
       FROM users WHERE email=$1`,
      [email]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

exports.softDeleteUser = async (id) => {
  try {
    const result = await db.query(
      `UPDATE users
     SET status = 'inactive',deleted_at=NOW()
     WHERE id = $1
     RETURNING *`,
      [id]
    );
    return result.rowCount;
  } catch (err) {
    throw err;
  }
};

//Generate and Save Reset Token
exports.saveResetToken = async (email, token, expiry) => {
  try {
    const query = `
            UPDATE users 
            SET reset_token = $1, token_expiry = $2
            WHERE email = $3
            RETURNING id, email;
        `;
    const result = await db.query(query, [token, expiry, email]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// 7. Find User by Reset Token (and check expiry)
exports.findUserByResetToken = async (token) => {
  try {
    const query = `
            SELECT id, email
            FROM users 
            WHERE reset_token = $1 AND token_expiry > NOW();
        `;
    const result = await db.query(query, [token]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// 8. Update Password and Clear Token
exports.updatePasswordAndClearToken = async (userId, newHashedPassword) => {
  try {
    const query = `
            UPDATE users 
            SET password = $1, reset_token = NULL, token_expiry = NULL, updated_at = NOW()
            WHERE id = $2
            RETURNING id, email;
        `;
    const result = await db.query(query, [newHashedPassword, userId]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};
