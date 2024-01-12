/**
 * Level Five Authentication
 * Create hashes from passwords, and store 
 * the hashes instead of plaintext or encrypted passwords.
 * Use the industry standard bcrypt for creating hashes, which also uses
 * the technique of salting to make even weak password difficult to decrypt
 * using hash tables.
 * We use multiple rounds of salting (10 in this template).
**/

// Import modules
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Setup express app
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

// Setup Mongoose Schema
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

// Setup Mongoose Models
const User = new mongoose.model("User", userSchema);

// Run middleware
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function (req, res) {
    try {
        bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
            const newUser = new User({
                email: req.body.username,
                password: hash
            });

            newUser.save();
            res.render("secrets");
        });
    } catch (err) {
        console.log(err);
    }
});

app.post("/login", async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const foundUser = await User.findOne({email: username});

        console.log(foundUser);

        bcrypt.compare(password, foundUser.password).then(function(result) {
            if (result) {
                res.render("secrets");
            } else {
                res.render('login');
            }
        });
    } catch (err) {
        console.log(err);
    }
});

// Run App
app.listen(port, function() {
    console.log(`Server started on port ${port}.`);
});

