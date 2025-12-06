const db = require("../config/db");

//Create User
exports.createUser = async (data) => {
  try {
    const result = await db.query(
      `INSERT INTO users (name,company_id,email,mobile,designation,role,address,city,pincode,password,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
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
        data.password,
        'active',
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
    const result = await db.query(
      `SELECT * FROM users WHERE mobile=$1`,
      [mobile]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};


//ReadUser by pagination

exports.getAllUsers = async (page, limit) => {
  try {
    page = Number(page);
    limit = Number(limit);

    const offset = (page - 1) * limit;

    const totalData = await db.query(
      `SELECT COUNT(*) FROM users WHERE status='active'`
    );
    const total = Number(totalData.rows[0].count);

    const result = await db.query(
      `SELECT * FROM users 
      WHERE status='active'
      ORDER BY id DESC
      LIMIT $1 OFFSET $2 `,
      [limit, offset]
    );

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
        role=$6,
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
        data.role,
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
    "role",
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
      u.role || null,
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
      `SELECT id, name, email, mobile, role, address, city, pincode, password
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
