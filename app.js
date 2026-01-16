const express=require("express")
const morgan = require("morgan");

const routes= require("./Routes/index.js")
const userRoutes = require("./Routes/user.routes");
const companyRoutes=require("./Routes/company.routes.js")
const {authenticate}=require ("./middlewares/auth.middlewares")
const logger = require("./config/logger.js")


const app=express();

//middelware - req,res,next()
// input sanitization/validation

app.use(express.json());

app.use(morgan('combined', { 
    stream: { write: message => logger.info(message.trim()) } 
}));

// Optional public routes
// app.use("/api/v1/adduser", routes);
// app.use("/api/v1/login", routes);

app.get('/getdata',(req,res)=>{
    
    logger.info("Server check API (/getdata) was hit");
    res.send({data:[],success:true,message:"server is running"})
    
})

app.use("/api/v1", authenticate, routes);

app.use((err, req, res, next) => {
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method}`);
    res.status(err.status || 500).json({
        success: false,
        message:err.message|| "Internal Server Error"
    });
});



const PORT=process.env.PORT || 4000;
app.listen(PORT,()=> {
    logger.info(`Server started successfully on port ${PORT}`);
    console.log(`Server running on port ${PORT}`)
});

