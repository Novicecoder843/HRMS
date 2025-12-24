
1.. write code for  insert 100 users at one insert query
2.. read why pagination needed in api ,implemnet pagination for getalluser api
3.. add userpassword field in insert user
    - use bycrypt and convert into hash and store
    - log in api with email and password(check email user exist or not, check the user password with db password ,create jwt token and send it in response)
4.implment deleted_at and status field as active/inactive field in users table and dont hard delete data 
5.implement soft delete in delete api

-------------------
6. implement middelware for validation using zod or joi library
7. add middelware for - authentication mechanism
8.global authentication mechanisim
9.store employee code -- 
10 - store depatrment id in users table
fetch department name using join on getall api