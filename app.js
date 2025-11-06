const  express = require("express");

const routes = require ("./routes/index.js");
//CRUD
// dotenv.config();

const app = express();

app.use(express.json());

// monorepo /polyrepo
// mvc/microservices


app.use("/api/v1", routes);
// app.use(errorMiddleware);
//mvc - model- bussiness logic 
//  view - frontend

//controller -- handle request,response,
app.get('/getdata', (req,res)=>{

    res.send({data:[],success:true,message:"server is running"})
} )


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
