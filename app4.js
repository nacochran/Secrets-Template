/**
 * Level Four Authentication
 * Create hashes from passwords, and store 
 * the hashes instead of plaintext or encrypted passwords.
 * Hashes are nearly impossible to reverse, so more secure 
 * than encryption algorithms which are designed to be decrypted.
 * We simply compare hashes instead of passwords when authenticating users.
**/

// Import modules
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

// test accessing API_KEY from environment variables
console.log("weak password hash: " + md5("123456"));
console.log("strong password hash: " + md5("sjkhdfsd8f7jhsd%%#sdfsdfHJKHSJFDHSF*7324"));

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
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    try {
        newUser.save();
        res.render("secrets");
    } catch (err) {
        console.log(err);
    }
});

app.post("/login", async function (req, res) {
    const username = req.body.username;
    const password = md5(req.body.password);

    try {
        const foundUser = await User.findOne({email: username});

        console.log(foundUser);
        if (foundUser.password === password) {
            res.render("secrets");
        } else {
            res.render('login');
        }
    } catch (err) {
        console.log(err);
    }
});

// Run App
app.listen(port, function() {
    console.log(`Server started on port ${port}.`);
});

