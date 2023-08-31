



const express = require('express');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');

const router = express.Router();

function verifyAdmin(req, res, next) {

    console.log(req.params)
    // console.log(req.body)
    const authheader = req.headers.authorization;
    const token = authheader && authheader.split(' ')[1];
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


router.post('/addproduct', verifyAdmin, async (req, res) => {

    const newProduct = new Product({

        title: req.body.title,
        author: req.body.author,
        publisher: req.body.publisher,
        language: req.body.language,
        paperback: req.body.paperback,
        isbn: req.body.isbn,
        isbn13: req.body.isbn13,
        dimensions: req.body.dimensions,
        pdffile: req.body.pdffile,
        audiofile: req.body.audiofile,
        weight: req.body.weight,
        age: req.body.age,
        subtitle: req.body.subtitle,
        category: req.body.category,
        description: req.body.description,
        rating: 0,
        total_rating: 0,
        reviews: [],
        price: req.body.price,
        created_by: "admin",
        image_url: req.body.image_url
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
    // console.log()
    Product.findOne({ 'id': Number(req.query.id) })
        .then(product => {

            product.title = req.body.title;
            product.author = req.body.author;
            product.publisher = req.body.publisher;
            product.language = req.body.language;
            product.paperback = req.body.paperback;
            product.isbn = req.body.isbn;
            product.isbn13 = req.body.isbn13;
            product.dimensions = req.body.dimensions;
            product.pdffile= req.body.pdffile;
            product.audiofile= req.body.audiofile;
            product.weight = req.body.weight;
            product.age = req.body.age;

            product.subtitle = req.body.subtitle;
            product.category = req.body.category;
            product.description = req.body.description;
            product.rating = req.body.rating;
            product.total_rating = req.body.total_rating;
            product.reviews = req.body.reviews;
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
    Product.deleteOne({ 'id': productId }, (err, doc) => {
        if (err) {
            res.status(500).json({ "message": "Error deleting product" });
        } else {
            res.status(200).json({ "message": "Product deleted successfully" });
        }
    });

});

router.get('/getproducts', (req, res) => {

    Product.find()
        .then(products => res.json(products))
        .catch(err => console.log(err));

});
router.get('/products/', (req, res) => {
    Product.findOne({ 'id': Number(req.query.id) })
        .then((product) => { return res.json(product) })
        .catch(err => console.log(err));

});
module.exports = router;

// how to findanddelete a document in mongoose using a different field then id