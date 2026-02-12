const Company = require('../models/company.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const companyService = {

    signup: async (data) => {
        const existingCompany = await Company.findByEmail(data.email);
        if (existingCompany) throw new Error('Email already exists');

        return await Company.create(data);
    },

    login: async (email, password) => {

        const company = await Company.findByEmail(email);
        if (!company) throw new Error('Company not found');

        const match = await bcrypt.compare(password.trim(), company.password);
        if (!match) throw new Error('Invalid password');

        //  Generate JWT Token INCLUDING ROLE
        const token = jwt.sign(
            {
                id: company.id,
                email: company.email,
                 role: company.role  // ✅ Add role here
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Remove password before returning
        const { password: _, ...companyData } = company;

        return {
            company: companyData,
            token
        };
    }

};

module.exports = companyService;
