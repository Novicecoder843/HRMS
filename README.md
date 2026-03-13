# HRMS
HRMS  - (PAyroll,attendance,leave,user manage)

# Task 1 requirement

1. Master Tables

# companies
company_id, name, address, industry, settings
CREATE TABLE companies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ALIAS
    addrees
    city
    pincode
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
    updATED_AT
    DELETED_AT
);


# departments
dept_id, company_id, dept_name, manager_id

# designations
designation_id, name, level, company_id

# users (employees)
user_id, emp_code, first_name, last_name, email, phone,
company_id, dept_id, designation_id,role_id
date_of_joining, date_of_exit, status

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role_id BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


Create CRUD for Each Module with proper API method and Folder and file structure
-create api
-view api - getbyid
-view all - getall
-edit - updateby id with data api
-delete - deleteby id api