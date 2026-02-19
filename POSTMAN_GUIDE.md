# HRMS API Testing Guide - Postman Endpoints

## 🚀 Quick Start

### Prerequisites
1. **Run Database Schema**
   ```bash
   # Import the schema into your MySQL database
   mysql -u root -p company_management_db < database/schema.sql
   ```

2. **Start the Server**
   ```bash
   npm run dev
   ```

3. **Expected Output**
   ```
   MySQL Connected Successfully
   Server running on port 5000
   ```

---

## 📍 API Endpoints

### 1️⃣ Company Signup (No Auth Required)

**Endpoint:** `POST http://localhost:5000/api/company/signup`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Tech Solutions Inc",
  "alias": "TechSol",
  "address": "123 Business Street",
  "email": "admin@techsolutions.com",
  "password": "SecurePass123!",
  "city": "Mumbai",
  "pincode": "400001",
  "is_active": true
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "message": "Company registered successfully",
    "company_id": 1
  }
}
```

**Note:** This automatically creates a "superadmin" role for the company.

---

### 2️⃣ Company Login (No Auth Required)

**Endpoint:** `POST http://localhost:5000/api/company/login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "admin@techsolutions.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Tech Solutions Inc",
    "alias": "TechSol",
    "email": "admin@techsolutions.com",
    "city": "Mumbai",
    "pincode": "400001",
    "is_active": 1,
    "role": "superadmin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**⚠️ IMPORTANT:** Copy the `token` value. You'll need it for all subsequent requests!

---

## 🔐 Authenticated Endpoints

**For all endpoints below, add this header:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

Replace `YOUR_TOKEN_HERE` with the token from the login response.

---

### 3️⃣ Create Role

**Endpoint:** `POST http://localhost:5000/api/roles`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body:**
```json
{
  "role_name": "HR Manager",
  "status": true
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "message": "Role created successfully",
    "role_id": 2
  }
}
```

---

### 4️⃣ Get All Roles

**Endpoint:** `GET http://localhost:5000/api/roles`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "role_name": "superadmin",
      "company_id": 1,
      "status": 1,
      "created_at": "2026-02-11T06:00:00.000Z",
      "updated_at": "2026-02-11T06:00:00.000Z"
    },
    {
      "id": 2,
      "role_name": "HR Manager",
      "company_id": 1,
      "status": 1,
      "created_at": "2026-02-11T06:05:00.000Z",
      "updated_at": "2026-02-11T06:05:00.000Z"
    }
  ]
}
```

---

### 5️⃣ Get Role by ID

**Endpoint:** `GET http://localhost:5000/api/roles/2`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "role_name": "HR Manager",
    "company_id": 1,
    "status": 1,
    "created_at": "2026-02-11T06:05:00.000Z",
    "updated_at": "2026-02-11T06:05:00.000Z"
  }
}
```

---

### 6️⃣ Update Role

**Endpoint:** `PUT http://localhost:5000/api/roles/2`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body:**
```json
{
  "role_name": "Senior HR Manager",
  "status": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Role updated successfully"
  }
}
```

---

### 7️⃣ Delete Role

**Endpoint:** `DELETE http://localhost:5000/api/roles/2`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Role deleted successfully"
  }
}
```

**Note:** This is a soft delete. The role is marked as deleted but not removed from the database.

---

### 8️⃣ Create User

**Endpoint:** `POST http://localhost:5000/api/users`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@techsolutions.com",
  "password": "UserPass123!",
  "role_id": 2,
  "status": true
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "message": "User created successfully",
    "user_id": 1
  }
}
```

---

### 9️⃣ Get All Users

**Endpoint:** `GET http://localhost:5000/api/users`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "company_id": 1,
      "role_id": 2,
      "name": "John Doe",
      "email": "john.doe@techsolutions.com",
      "status": 1,
      "role_name": "HR Manager",
      "created_at": "2026-02-11T06:10:00.000Z",
      "updated_at": "2026-02-11T06:10:00.000Z"
    }
  ]
}
```

**Note:** Password is excluded from the response for security.

---

### 🔟 Get User by ID

**Endpoint:** `GET http://localhost:5000/api/users/1`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "company_id": 1,
    "role_id": 2,
    "name": "John Doe",
    "email": "john.doe@techsolutions.com",
    "status": 1,
    "role_name": "HR Manager",
    "created_at": "2026-02-11T06:10:00.000Z",
    "updated_at": "2026-02-11T06:10:00.000Z"
  }
}
```

---

### 1️⃣1️⃣ Update User

**Endpoint:** `PUT http://localhost:5000/api/users/1`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@techsolutions.com",
  "role_id": 2,
  "status": true,
  "password": "NewPassword123!"
}
```

**Note:** All fields are optional. Only include fields you want to update.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "User updated successfully"
  }
}
```

---

### 1️⃣2️⃣ Delete User

**Endpoint:** `DELETE http://localhost:5000/api/users/1`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "User deleted successfully"
  }
}
```

**Note:** This is a soft delete. The user is marked as deleted but not removed from the database.

---

## 🧪 Testing Workflow

### Step-by-Step Testing:

1. **Company Signup** → Creates company + auto-creates "superadmin" role
2. **Company Login** → Get JWT token with role information
3. **Create Role** → Add "HR Manager" role (use token from step 2)
4. **Get All Roles** → Verify both "superadmin" and "HR Manager" exist
5. **Create User** → Add user with "HR Manager" role
6. **Get All Users** → Verify user was created with role name
7. **Update User** → Change user details
8. **Update Role** → Change role name
9. **Delete User** → Soft delete user
10. **Delete Role** → Soft delete role

---

## ⚠️ Common Errors

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```
**Solution:** Add `Authorization: Bearer YOUR_TOKEN` header.

### 400 Bad Request
```json
{
  "success": false,
  "message": "Email already exists for this company"
}
```
**Solution:** Use a different email address.

### 404 Not Found
```json
{
  "success": false,
  "message": "Role not found"
}
```
**Solution:** Verify the ID exists and belongs to your company.

---

## 🎯 Key Features

✅ **Auto Role Creation** - "superadmin" role created on company signup  
✅ **JWT Authentication** - Token includes company ID, email, and role  
✅ **Company Scoping** - Users can only access their own company's data  
✅ **Soft Deletes** - Deleted records are preserved with `deleted_at` timestamp  
✅ **Password Security** - Passwords are hashed with bcrypt  
✅ **Role Validation** - Users must have valid roles from their company
