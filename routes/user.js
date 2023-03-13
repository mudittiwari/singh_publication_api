const router = require("express").Router();
const User = require("../models/User");
const cryptojs = require("crypto-js");
const jwt = require("jsonwebtoken");
const Product = require('../models/Product');
const { verifytoken } = require("../routes/verifyAccessToken");

function verifyAdmin(req, res, next) {

    
    const token = req.headers['token'];
    console.log(token)
    
    jwt.verify(token, process.env.JWT_SEC, (err, decoded) => {

        
        if (err) {

            return res.status(401).json({ message: 'Unauthorized access' });

        } else {
            console.log(decoded);
            // Check if user is admin or not 
            if (decoded.isAdmin === 'admin') {

                next();

            } else {

                return res.status(403).json({ message: 'Forbidden access' });

            }

        }

    });
}

router.post("/register", async (req, res) => {
    const user_ = new User({
        firstname: req.body.firstname,
        dob: req.body.dob,
        lastname: req.body.lastname,
        email: req.body.email,
        password: cryptojs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
        gender: req.body.gender,
        phone_number: req.body.mobile,
        billing_address:{'house':"",'area':"", 'city':"", 'street':"", 'pincode':""},
        shipping_address:{'house':"",'area':"", 'city':"", 'street':"", 'pincode':""},
        //   wishlist:[String],
        //   cart:[String],
        //   orders:[{type : mongoose.Schema.Types.ObjectId , ref : 'Order'}],
    })
    try {
        const user = await user_.save();
        res.status(201).json("success");

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }

});

router.post("/login", async (req, res) => {
    const username = req.body.email;
    const password = req.body.password;
    // console.log(req.body);
    const user = await User.findOne({ email: username });
    console.log(user._doc)
    if (user) {
        // console.log(cryptojs.AES.decrypt(user.password,process.env.PASS_SEC).toString(cryptojs.enc.Utf8));
        if (cryptojs.AES.decrypt(user.password, process.env.PASS_SEC).toString(cryptojs.enc.Utf8) == password.toString()) {
            const { password, ...others } = user._doc;
            const accessToken = jwt.sign({
                id: user._id,
                isAdmin: user.role,
            }, process.env.JWT_SEC);
            res.status(200).json({ ...others, accessToken });
        }
        else {
            res.status(400).json("bad credentials");
        }
    }
    else {
        res.status(400).json("user not found");
    }

});

router.post("/updateuser", verifytoken, async (req, res) => {
    User.findOne({ 'id': Number(req.query.id) })
        .then(User => {

            User.firstname = req.body.firstname;
            User.lastname = req.body.lastname;
            User.email = req.body.email;
            User.save()
                .then(User => res.json(User))
                .catch(err => console.log(err));

        })
        .catch(err => console.log(err));
});

router.post("/addtocart", verifytoken, async (req, res) => {
    User.findOne({ 'id': Number(req.query.id) }).then(User => {
        //check if user cart already has the product
        if (!User.cart.includes(req.body.product_id)) {
            Product.findOne({ 'id': Number(req.body.product_id) }).then(product => {
                if (product) {
                    User.cart.push(req.body.product_id);
                    User.save()
                        .then(User => res.json(User))
                        .catch(err => console.log(err));
                }
                else {
                    res.status(400).json("product not found");
                }
            });

        }
        else {
            res.status(400).json("product already in cart");
        }

    })
        .catch(err => console.log(err));
});

router.post("/removefromcart", verifytoken, async (req, res) => {
    User.findOne({ 'id': Number(req.query.id) }).then(User => {
        if (User.cart.includes(req.body.product_id)) {
            User.cart.pull(req.body.product_id);
            User.save()
                .then(User => res.json(User))
                .catch(err => console.log(err));
        }
        else {
            res.status(400).json("product not in cart");
        }

    })

        .catch(err => console.log(err));
});

router.post("/addtowishlist", verifytoken, async (req, res) => {
    User.findOne({ 'id': Number(req.query.id) }).then(User => {
        if (!User.wishlist.includes(req.body.product_id)) {
            Product.findOne({ 'id': Number(req.body.product_id) }).then(product => {
                if (product) {
                    User.wishlist.push(req.body.product_id);
                    User.save()

                        .then(User => res.json(User))
                        .catch(err => console.log(err));
                }
                else {
                    res.status(400).json("product not found");
                }
            });
        }
        else {
            res.status(400).json("product already in wishlist");
        }

    })
        .catch(err => console.log(err));
});

router.post("/removefromwishlist", verifytoken, async (req, res) => {
    User.findOne({ 'id': Number(req.query.id) }).then(User => {
        if (User.wishlist.includes(req.body.product_id)) {
            User.wishlist.pull(req.body.product_id);
            User.save()
                .then(User => res.json(User))
                .catch(err => console.log(err));
        }
        else {
            res.status(400).json("product not in wishlist");
        }

    })
        .catch(err => console.log(err));
});

router.post('/updatebillingaddress', verifytoken, async (req, res) => {
    User.findOne({ 'id': Number(req.query.id) })
        .then(User => {
            // 'house':"",'area':"", 'city':"", 'street':"", 'pincode':""
            let billing_address = {
                'house': req.body.house,
                'area': req.body.area,
                'city': req.body.city,
                'street': req.body.street,
                'pincode': req.body.pincode
            }
            User.billing_address = billing_address;
            User.save()
                .then(User => res.json(User))
                .catch(err => console.log(err));

        })
        .catch(err => console.log(err));
});
router.post('/updateshippingaddress', verifytoken, async (req, res) => {
    User.findOne({ 'id': Number(req.query.id) })
        .then(User => {
            // 'house':"",'area':"", 'city':"", 'street':"", 'pincode':""
            User.shipping_address.house=req.body.house;
            User.shipping_address.area=req.body.area;
            User.shipping_address.city=req.body.city;
            User.shipping_address.street=req.body.street;
            User.shipping_address.pincode=req.body.pincode;
            User.save()
                .then(User => res.json(User))
                .catch(err => console.log(err));

        })
        .catch(err => console.log(err));
});


router.get("/getallusers", verifyAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get("/getuser", verifytoken, async (req, res) => {
    try {
        const user = await User.findOne({ 'id': Number(req.query.id) });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});





module.exports = router

// mongoose not creating unique _id field in mongodb