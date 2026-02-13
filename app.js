const express = require('express');
const app = express();

const companyRoutes = require('../HRMS/routes/company.routes');
const rolesRoutes = require('../HRMS/routes/role.routes'); 
const usersRoutes = require('../HRMS/routes/user.routes')
app.use(express.json());

app.use('/api/companies', companyRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/users',usersRoutes)
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
