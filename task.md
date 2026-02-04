add password field in users table
and while storing convert the apssword into hashing password and store by using bycrypt  library

log in api  - take email and password 
check with email user exist or not  - if not throw error user not found
- check user status and deleteat - if statys is inactive and deletatd at not null then throw error user is inactive please contact to admin
- compare user input password with db user password using bcrypt - true/false
 first read what is jwt and its feture and how to implement 
 create jwt token with user id , email ,role
send token with user data , dont send the password

-- mark email and mobile unique
-- limit and pagination

-- implement functionality  to print the what querry is running in command line server logs
-- implement error log in all api
--

9th DEc
- implement validation using jod or joi for every route
-- midelware function
-- implimention with pagination attendance with today, last7 days and custom 
-- custom means showing each month and each year
-- implimention  with pagnation  shift  with jeneral and morning and night shift