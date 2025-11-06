const db = require('../config/db')
exports.createUser = async (data) =>{

    try{
        const result = await db.query(
            `INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING *`,
            [data.name, data.email, role || null]
          );
    }catch(error){
        return error
    }

}