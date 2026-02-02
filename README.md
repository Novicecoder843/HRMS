# HRMS
HRMS  - (PAyroll,attendance,leave,user manage)

# Task 1 requirement

1. Master Tables

# companies
company_id, name, address, industry, settings

# departments
dept_id, company_id, dept_name, manager_id

# designations
designation_id, name, level, company_id

# users (employees)
user_id, emp_code, first_name, last_name, email, phone,
company_id, dept_id, designation_id,role_id
date_of_joining, date_of_exit, status

Create CRUD for Each Module with proper API method and Folder and file structure
-create api
-view api - getbyid
-view all - getall
-edit - updateby id with data api
-delete - deleteby id api



--- logging mechanism

--api logs and error logs

-- correct response with status code

