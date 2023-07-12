const express=require("express");
const app=express();
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const cors = require('cors');
const userRoute=require("./routes/user");
const Coupon = require('./models/Coupon');
const nodemailer = require('nodemailer');
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'singhpublicationjaipur@gmail.com',
        pass: 'gggiibhxdwbofwxv'
    }
});
// const authRoute=require("./routes/auth");
const productRoute=require("./routes/product");
const orderRoute=require("./routes/order");

//app.use(cors())
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
//origin:['https://singhpublication.in','https://mudittiwari.github.io','http://localhost:3000','https://singhpublications.vercel.app/']
   origin: '*'
}));

const couponurls=[
    {url:"https://singhpublications.in/#/applycoupon/8S5JLX",book:'E-Book'},
    {url:"https://singhpublications.in/#/applycoupon/WNIFS1",book:'E-Book'},
    {url:"https://singhpublications.in/#/applycoupon/K5HJ1Z",book:'E-Book'},
    {url:"https://singhpublications.in/#/applycoupon/CN6OVP",book:'E-Book'},
    {url:"https://singhpublications.in/#/applycoupon/L7DJ3U",book:'E-Book'},
    {url:"https://singhpublications.in/#/applycoupon/KVH20F",book:'E-Book'},
    {url:"https://singhpublications.in/#/applycoupon/M8BDIZ",book:'E-Book'},
    {url:"https://singhpublications.in/#/applycoupon/B7PGQS",book:'E-Book'},
    {url:"https://singhpublications.in/#/applycoupon/LCHXBI",book:'E-Book'},
    {url:"https://singhpublications.in/#/applycoupon/0E5CBZ",book:'E-Book'},
    {url:"https://singhpublications.in/#/applycoupon/GRPNSO",book:'E-Book'},
    {url:"https://singhpublications.in/#/applycoupon/HIPRMF",book:'E-Book'},
    {url:"https://singhpublications.in/#/applycoupon/89BI4O",book:'E-Book'},
    {url:"https://singhpublications.in/#/applycoupon/SYR731",book:'E-Book'},
    {url:"https://singhpublications.in/#/applycoupon/IZ4376",book:'E-Book'},
]
function initializecupons()
{
    Coupon.deleteMany({}).then((res)=>{
        console.log("deleted");
    }).catch((e)=>{console.log(e)})
    const coupon = new Coupon({
        coupons: couponurls,
    });
    coupon.save().then((res)=>{
        console.log("Coupons added");
    }).catch((e)=>{console.log(e)})
    
}

app.use("/api/user/",userRoute);
// app.use("/api/auth/",authRoute);
app.use("/api/product/",productRoute);
app.use("/api/order/",orderRoute);
app.post('/api/contact', (req, res) => {
    let mailDetails = {
        from: req.body.email,
        to: 'singhpublicationjaipur@gmail.com',
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

app.get('/api/getcoupons', (req, res) => {
    Coupon.find().then((coupons)=>{
        res.status(200).json(coupons[0].coupons);
    }).catch((e)=>{
        res.status(500).json(e);
    });
});

app.post('/api/deletecoupon', (req, res) => {
    let coupon = req.body.coupon;
    // console.log(coupon)
    Coupon.find().then((coupons)=>{
        for(let i=0;i<coupons[0].coupons.length;i++)
        {
            let url = coupons[0].coupons[i].url;
            let arr=url.split('/');
            url=arr[arr.length-1];
            if(url==coupon)
            {
                // console.log("deleted");
                coupons[0].coupons.splice(i,1);
                break;
            }
        }
        // console.log(coupons[0].coupons);
        Coupon.updateOne({},{coupons:coupons[0].coupons}).then((response)=>{
            res.status(200).json("success");
        }
        ).catch((e)=>{console.log(e);res.status(500).json(e);});
        
    }).catch((e)=>{res.status(500).json(e);});
});


initializecupons();
app.listen(process.env.PORT || 5000,()=>{
    console.log("backend server is running");

})
