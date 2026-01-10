const { number } = require("zod");
const db = require("../config/db");
const bcrypt = require("bcrypt");

// user.service.js (The correct and robust implementation)

exports.getNextEmpSequence = async (prefix, companyId) => {
  try {
    const query = `
    SELECT 
        COALESCE(
            MAX(
                -- Robustly extracts only digits from the EmpCode for maximum safety
                CAST(REGEXP_REPLACE(emp_code, '^[^0-9]*(\\d*)$', '\\1') AS INTEGER)
            ), 
            0
        ) + 1 AS next_sequence
    FROM users
    WHERE emp_code ILIKE $1 || '%' 
    AND company_id = $2;
    `;
    const result = await db.query(query, [prefix, companyId]);
    return result.rows[0].next_sequence;
  } catch (err) {
    throw new Error(`Error fetching next EmpCode sequence: ${err.message}`);
  }
};

//Create User
exports.createUser = async (data) => {
  try {
    const { emp_code, dept_id, shift_id, ...userData } = data;

    const result = await db.query(
      `INSERT INTO users (name,company_id,email,mobile,designation,role_id,address,city,pincode,password,status,emp_code,dept_id,shift_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [
        userData.name,
        userData.company_id,
        userData.email,
        userData.mobile,
        userData.designation,
        userData.role_id,
        userData.address,
        userData.city,
        userData.pincode || null,
        userData.password,
        "active",
        emp_code,
        dept_id || null,
        shift_id || null,
      ]
    );

    return result.rows[0];
  } catch (error) {
    throw error;
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

//upload user data by excel
exports.processExcelRow = async (row) => {
  let companyRes = await db.query(
    "SELECT company_id FROM companies WHERE name=$1",
    [row.company_name]
  );
  let company_id;
  if (companyRes.rows.length > 0) {
    company_id = companyRes.rows[0].company_id;
  } else {
    let newComp = await db.query(
      `INSERT INTO companies (name, email, mobile, address, city, pincode) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING company_id`,
      [
        row.company_name,
        row.company_email,
        row.company_mobile,
        row.company_address,
        row.company_city,
        row.company_pincode,
      ]
    );
    company_id = newComp.rows[0].company_id;
  }

  let dept_id = null;
  if (row.department_name) {
    let deptRes = await db.query(
      "SELECT id from departments WHERE name=$1 AND company_id=$2",
      [row.department_name, company_id]
    );
    if (deptRes.rows.length > 0) {
      dept_id = deptRes.rows[0].id;
    } else {
      let newDept = await db.query(
        "INSERT INTO departments (name, company_id) VALUES ($1, $2) RETURNING id",
        [row.department_name, company_id]
      );
      dept_id = newDept.rows[0].id;
    }
  }

  let roleRes = await db.query("SELECT id FROM roles WHERE role_name = $1", [
    row.role_name || "Employee",
  ]);
  const role_id = roleRes.rows.length > 0 ? roleRes.rows[0].id : 2;

  const prefix = row.company_name.substring(0, 3).toUpperCase();

  const lastUserRes = await db.query(
    `SELECT emp_code FROM users 
   WHERE company_id = $1 AND emp_code LIKE $2 
   ORDER BY length(emp_code) DESC, emp_code DESC LIMIT 1`,
    [company_id, `${prefix}%`]
  );

  let seq = 1;
  if (lastUserRes.rows.length > 0) {
    const lastCode = lastUserRes.rows[0].emp_code;

    const lastNumber = parseInt(lastCode.replace(prefix, ""));

    if (!isNaN(lastNumber)) {
      seq = lastNumber + 1;
    }
  }

  const emp_code = `${prefix}${String(seq).padStart(4, "0")}`;

  const hashPassword = await bcrypt.hash("Pass@123", 10);
  const mobile = "91" + row.mobile;

  const newUser = await db.query(
    `INSERT INTO users (name, company_id, email, mobile, designation, role_id, address, city, pincode, password, status, emp_code, dept_id) 
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
    [
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
    console.error(err);
    throw new Error("Error fetching detailed users: " + err.message);
  }
};

//ReadUser by pagination
exports.getAllUsers = async (page, limit, companyId) => {
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
    }

    const countQuery = `SELECT COUNT(*) FROM users u WHERE ${whereConditions.replace(
      "$3",
      "$1"
    )}`;
    const totalData = await db.query(countQuery, countQueryParams);
    const total = Number(totalData.rows[0].count);

    const mainQuery = `SELECT
        u.id,
        u.emp_code,
        u.name AS user_name, 
        u.email, 
        u.role_id,
        c.name AS company_name, 
        d.name AS department_name, 
        r.role_name AS role_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id 
      LEFT JOIN companies c ON u.company_id = c.company_id 
      LEFT JOIN departments d ON u.dept_id = d.id
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
    const query = `
      SELECT
        u.id,
        u.emp_code,
        u.name AS user_name, 
        u.email, 
        c.name AS company_name, 
        d.name AS department_name, 
        u.role_id,
        r.role_name AS role_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id 
      LEFT JOIN companies c ON u.company_id = c.company_id 
      LEFT JOIN departments d ON u.dept_id = d.id
      WHERE u.id = $1 AND u.status = 'active'
    `;

    const result = await db.query(query, [id]);

    return result.rows[0];
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
        dept_id=$10,
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
        data.dept_id || null,
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
    "password",
    "emp_code",
    "status",
    "dept_id",
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
      u.pincode || null,
      u.password,
      u.emp_code,
      u.status || "active",
      u.dept_id || null
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
      `SELECT id, name, email, mobile, role_id, address, city, pincode, password,shift_id
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
