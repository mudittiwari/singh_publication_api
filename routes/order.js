const router = require("express").Router();
const Order = require("../models/Order");
const { verifytoken } = require("../routes/verifyAccessToken");
const User = require("../models/User");
const jwt = require('jsonwebtoken');

function verifyAdmin(req, res, next) {

    console.log(req.params)
    // console.log(req.body)
    const authheader=req.headers.authorization;
    const token=authheader && authheader.split(' ')[1];
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

router.post("/createorder", verifytoken, async (req, res) => {
    const order_ = new Order({
        ProductsArray: req.body.ProductsArray,
        totalAmount: req.body.totalAmount,
        ordered_by: req.body.ordered_by,
        // delivery_date: req.body.delivery_date,
        delivery_status: req.body.delivery_status,
        invoice_file: "",
    })
    try {
        await order_.save().then((order) => {
            User.findOne({ 'id': Number(req.query.id) }).then(User => {
                User.orders.push({
                    ProductsArray: req.body.ProductsArray,
                    totalAmount: req.body.totalAmount,
                    delivery_date: req.body.delivery_date,
                    delivery_status: req.body.delivery_status,
                    order_id: order.id,
                    invoice_file: "",
                });
                User.save()
                    .then(User => res.json(User))
                    .catch(err => console.log(err));

            })
                .catch(err => console.log(err));
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });


    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
router.delete("/deleteorder", verifytoken, async (req, res) => {
    try {
        Order.findOneAndDelete({ 'id': Number(req.body.order_id) }).then(order => {
            console.log(order);
            User.updateOne({ id: Number(req.query.id) }, { "$pull": { "orders": { "order_id": req.body.order_id } } }, { safe: true, multi: true }, function (err, User_) {
                console.log(User_)
                if (User_.modifiedCount == 1) {
                    res.status(200).json("Order deleted successfully");
                }
                else {
                    res.status(500).json("Order not deleted");
                }

            });
        })
            .catch(err => console.log(err));

    } catch (error) {
        res.status(500).json(error);
    }
});
router.put("/updateorder", verifytoken, async (req, res) => {
    try {
        Order.findOneAndUpdate({ 'id': Number(req.body.order_id) }, { $set: { delivery_status: req.body.delivery_status } }, { new: true }).then(order => {
            console.log(order);
            User.updateOne({ id: Number(req.query.id) }, { "$pull": { "orders": { "order_id": req.body.order_id } } }, { safe: true, multi: true }, function (err, User_) {
                console.log(User_)
                if (User_.modifiedCount == 1) {
                    User.findOne({ 'id': Number(req.query.id) }).then(User => {
                        User.orders.push({
                            ProductsArray: order.ProductsArray,
                            totalAmount: order.totalAmount,
                            delivery_date: order.delivery_date,
                            delivery_status: order.delivery_status,
                            order_id: order.id,
                            invoice_file: order.invoice_file
                        });
                        User.save()
                            .then(User => res.json("Order updated successfully"))
                            .catch(err => console.log(err));

                    })
                        .catch(err => console.log(err));
                }
                else {
                    res.status(500).json("Order not updated");
                }

            });
        })
            .catch(err => console.log(err));

    } catch (error) {
        res.status(500).json(error);
    }
});



router.put("/updatedelivery", verifyAdmin, async (req, res) => {
    try {
        Order.findOneAndUpdate({ 'id': Number(req.body.order_id) }, { $set: {"delivery_date":req.body.delivery_date } }, { new: true }).then(order => {
            console.log(order);
            User.updateOne({ 'email': req.body.useremail }, { "$pull": { "orders": { "order_id": req.body.order_id } } }, { safe: true, multi: true }, function (err, User_) {
                console.log(User_)
                if (User_.modifiedCount == 1) {
                    User.findOne({ 'email': req.body.useremail }).then(User => {
                        User.orders.push({
                            ProductsArray: order.ProductsArray,
                            totalAmount: order.totalAmount,
                            delivery_date: order.delivery_date,
                            delivery_status: order.delivery_status,
                            order_id: order.id,
                            invoice_file: order.invoice_file
                        });
                        User.save()
                            .then(User => res.json("Order delivery status updated successfully"))
                            .catch(err => console.log(err));

                    })
                        .catch(err => console.log(err));
                }
                else {
                    res.status(500).json("Order not updated");
                }

            });
        })
            .catch(err => console.log(err));

    } catch (error) {
        res.status(500).json(error);
    }
});



router.put("/updateinvoice", verifyAdmin, async (req, res) => {
    try {
        Order.findOneAndUpdate({ 'id': Number(req.body.order_id) }, { $set: { invoice_file: req.body.invoice_file } }, { new: true }).then(order => {
            console.log(order);
            User.updateOne({ 'email': req.body.useremail }, { "$pull": { "orders": { "order_id": req.body.order_id } } }, { safe: true, multi: true }, function (err, User_) {
                console.log(User_)
                if (User_.modifiedCount == 1) {
                    User.findOne({ 'email': req.body.useremail }).then(User => {
                        User.orders.push({
                            ProductsArray: order.ProductsArray,
                            totalAmount: order.totalAmount,
                            delivery_date: order.delivery_date,
                            delivery_status: order.delivery_status,
                            order_id: order.id,
                            invoice_file: order.invoice_file
                        });
                        User.save()
                            .then(User => res.json("Order invoice updated successfully"))
                            .catch(err => console.log(err));

                    })
                        .catch(err => console.log(err));
                }
                else {
                    res.status(500).json("Order not updated");
                }

            });
        })
            .catch(err => console.log(err));

    } catch (error) {
        res.status(500).json(error);
    }
});


//user function to get the orders
router.get("/getuserorders", verifytoken, async (req, res) => {
    try {
        User.findOne({ 'id': Number(req.query.id) }).then(User => {
            res.status(200).json(User.orders);
        })
            .catch(err => console.log(err));

    } catch (error) {
        res.status(500).json(error);
    }
});

//admin function to get all orders
router.get("/getallorders", verifytoken, async (req, res) => {
    try {
        const orders = await Order.find();
        // console.log(orders);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router