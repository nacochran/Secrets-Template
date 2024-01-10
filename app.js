/**
 * Level Three Authentication
 * Use passwords to authenticate users when registering / logging in
 * Passwords are enrypted using the mongoose-encryption package
 * The secrets (keys, etc) are stored using environment variables to
 * keep them safe from inspection.
**/

// Import modules
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

// test accessing API_KEY from environment variables
console.log(process.env.API_KEY);

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

// add plugin to schema to extend its functionality (encryption in this case)
// use secret as the key to encrypt and decrypt
// only encrypt specified fields
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

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
        password: req.body.password
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
    const password = req.body.password;

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

