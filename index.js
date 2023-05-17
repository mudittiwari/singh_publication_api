const express=require("express");
const app=express();
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const cors = require('cors');
const userRoute=require("./routes/user");

const nodemailer = require('nodemailer');
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'muditpublication@gmail.com',
        pass: 'kjkviqhqljvngoiz'
    }
});
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
origin:['https://singhpublication.in','https://mudittiwari.github.io']
//   origin: 'http://localhost:3001'
}));
app.use("/api/user/",userRoute);
// app.use("/api/auth/",authRoute);
app.use("/api/product/",productRoute);
app.use("/api/order/",orderRoute);
app.post('/contact', (req, res) => {
    let mailDetails = {
        from: 'muditpublication@gmail.com',
        to: 'mudit19.072@gmail.com',
        subject: req.body.subject,
        text: `Name:${req.body.name}\nPhone:${req.body.phone}\nEmail:${req.body.email}\n`+req.body.message
    };
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            res.status(500).json(err);
        } else {
            res.status(200).json("success");
        }
    });
});


app.listen(process.env.PORT || 5000,()=>{
    console.log("backend server is running");

})