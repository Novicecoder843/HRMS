const { error } = require("winston");
const db=require("../config/db")

exports.createLeaveTypeService= async (data)=>{
    try {
        const{company_id,name,total_days}=data;
        const query=`
        INSERT INTO leave_types(company_id,name,total_days) 
        VALUES($1,$2,$3)
        RETURNING *
        `;
        const values=[company_id,name,total_days];
        const result= await db.query(query,values);
        return result.rows[0];
    } catch (err) {
        throw new Error(`Error in creating leave type:${err.message}`);
    }
}

exports.assignLeaveBalanceService= async(data)=>{
    try {
        const{user_id,leave_type_id,remaining_days,year}=data;
        const query=`
        INSERT INTO leave_balances(user_id,leave_type_id,remaining_days,year)
        VALUES($1,$2,$3,$4)
        ON CONFLICT (user_id,leave_type_id,year)
        DO UPDATE SET remaining_days=EXCLUDED.remaining_days
        RETURNING *
        `;

        const values=[user_id,leave_type_id,remaining_days,year];
        const result= await db.query(query,values);
        if (result.rows.length === 0) return null;

        const row = result.rows[0];

       return {
            ...row,
            remaining_days: parseFloat(row.remaining_days),
            used_days: parseFloat(row.used_days)
        };

    } catch (err) {
        throw new Error(`Error is assigning leave balance:${err.message}`);
    }
}

exports.applyLeaveService=async(data)=>{

    console.log("Service received data:", data);

    const {user_id,leave_type_id,start_date,end_date,total_days,reason}=data;

    const balanceCheck=await db.query(
        `
        SELECT remaining_days FROM leave_balances WHERE user_id=$1 AND leave_type_id=$2
        `,
        [user_id,leave_type_id]
    );

    if(balanceCheck.rows.length===0 || balanceCheck.rows[0].remaining_days<total_days){
        throw new Error("Insufficient leave balance!")
    }

    const query=`INSERT INTO leave_requests (user_id,leave_type_id,start_date,end_date,total_days,status,reason)
    VALUES($1,$2,$3,$4,$5,$6,$7)
    RETURNING *`;

    const values=[user_id,leave_type_id,start_date,end_date,total_days,'pending',reason || null];
    const result=await db.query(query,values);
     return result.rows[0];
}

exports.updateLeaveStatusService=async(requestId,status,managerId)=>{
    const client=await db.pgConnection.connect();
    try {
        await client.query('BEGIN');

        const requestRes = await client.query(
            "SELECT * FROM leave_requests WHERE id=$1",[requestId]
        );

        const request=requestRes.rows[0];

        if(!request) throw new Error("Leave request not found");
        if(request.status!=='pending')throw new Error("Request already processed");;

        await client.query(
            "UPDATE leave_requests SET status=$1,updated_at=NOW() WHERE id=$2",
            [status,requestId]
        )

        if(status==='approved'){
            const updateBalanceQuery=`
            UPDATE leave_balances
            SET remaining_days=remaining_days-$1,
            used_days=used_days+$1,
            updated_at=NOW()
            WHERE user_id=$2 AND leave_type_id=$3
            `;
            await client.query(updateBalanceQuery,[request.total_days,request.user_id,request.leave_type_id])
        }

        await client.query('COMMIT');
        return {
            message:`Leave ${status} successfully`
        };
    } catch (err) {
        await client.query('ROLLBACK');
        throw new Error(err.message);
    } finally {
        client.release();
    }
    }
