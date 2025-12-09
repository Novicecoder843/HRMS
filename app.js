const express=require("express")

const routes= require("./Routes/index.js")
const userRoutes = require("./Routes/user.routes");
const companyRoutes=require("./Routes/company.routes.js")
const {authenticate}=require ("./middlewares/auth.middlewares")


const app=express();

//middelware - req,res,next()
// input sanitization/validation

app.use(express.json());


// Optional public routes
// app.use("/api/v1/adduser", routes);
// app.use("/api/v1/login", routes);

app.get('/getdata',(req,res)=>{
    
    res.send({data:[],success:true,message:"server is running"})
    
})

app.use("/api/v1", authenticate, routes);



const PORT=process.env.PORT || 4000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
