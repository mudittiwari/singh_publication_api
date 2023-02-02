



const express = require('express');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');

const router = express.Router();

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


router.post('/addproduct', verifyAdmin, async(req, res) => {

    const newProduct = new Product({

        name: req.body.name,
    price: req.body.price,
    created_by: req.body.created_by,
    image_url : req.body.image_url
    });

    try {
        const prod = await newProduct.save();
        res.status(201).json(prod);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

router.post('/updateproduct', verifyAdmin, (req, res) => {
        Product.findOne({'id':Number(req.query.id)})
            .then(product => {
    
                product.name = req.body.name;
                product.price = req.body.price;
                product.created_by = req.body.created_by;
                product.image_url = req.body.image_url;
    
                product.save()
                    .then(product => res.json(product))
                    .catch(err => console.log(err));
    
            })
            .catch(err => console.log(err));
    
});

router.delete('/deleteproduct', verifyAdmin, (req, res) => {
    const productId = Number(req.query.id);
    Product.deleteOne({'id': productId}, (err, doc) => {
        if (err) {
            res.status(500).json({"message":"Error deleting product"});
        } else {
            res.status(200).json({"message":"Product deleted successfully"});
        }
    });

});

router.get('/getproducts', (req, res) => {

    Product.find()
        .then(products => res.json(products))
        .catch(err => console.log(err));

});
router.get('/products/:id', (req, res) => {

    Product.findOne({'id':req.params.id})
        .then(product => res.json(product))
        .catch(err => console.log(err));

});
module.exports = router;

// how to findanddelete a document in mongoose using a different field then id