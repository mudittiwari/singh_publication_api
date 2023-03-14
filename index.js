const express=require("express");
const app=express();
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const userRoute=require("./routes/user");
// const authRoute=require("./routes/auth");
const productRoute=require("./routes/product");
const orderRoute=require("./routes/order");
var cors = require('cors')

app.use(cors())
app.use(express.json());


dotenv.config();
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("db connection successfully");
}).catch((e)=>{
    console.log("mudit tiwari")
    console.log(e);
});

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://mudittiwari.github.io/');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });
app.use("/api/user/",userRoute);
// app.use("/api/auth/",authRoute);
app.use("/api/product/",productRoute);
app.use("/api/order/",orderRoute);



app.listen(process.env.PORT || 5000,()=>{
    console.log("backend server is running");

})