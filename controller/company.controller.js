const companyService = require('../services/company.service');

const companyController = {

    signupCompany: async (req, res) => {
        try {
            await companyService.signup(req.body);

            res.status(201).json({
                message: 'Company registered successfully'
            });

        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    loginCompany: async (req, res) => {
        try {
            const { email, password } = req.body;

            const data = await companyService.login(email, password);

            res.status(200).json({
                message: 'Login successful',
                token: data.token,
                // company: data.company
            });

        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

};

module.exports = companyController;
