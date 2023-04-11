const express=require("express");
const app=express();
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const cors = require('cors');
const userRoute=require("./routes/user");
// const authRoute=require("./routes/auth");
const productRoute=require("./routes/product");
const orderRoute=require("./routes/order");

// app.use(cors())
app.use(express.json());


dotenv.config();
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("db connection successfully");
}).catch((e)=>{
    console.log("mudit tiwari")
    console.log(e);
});

app.use(cors({
//   origin: 'https://mudittiwari.github.io'
  origin: 'http://localhost:3000'
}));
app.use("/api/user/",userRoute);
// app.use("/api/auth/",authRoute);
app.use("/api/product/",productRoute);
app.use("/api/order/",orderRoute);



app.listen(process.env.PORT || 1234,()=>{
    console.log("backend server is running");

})