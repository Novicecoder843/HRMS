const express=require("express")

const routes= require("./Routes/index.js")


const app=express();

//middelware - req,res,next()
// input sanitization/validation
app.use(express.json());


app.use("/api/v1",routes)

app.get('/getdata',(req,res)=>{

res.send({data:[],success:true,message:"server is running"})

})


const PORT=process.env.PORT || 4000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
