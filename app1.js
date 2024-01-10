/*
 * Level One Authentication
 * Use passwords to authenticate users when registering / logging in
 * Passwords can be viewed in plaintext in the database, making it easier 
 * for hackers or rogue employees to gain illegal access to passwords
*/

// Import modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

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

