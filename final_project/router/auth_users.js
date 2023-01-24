const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
        "username": "user15",
        "password": "pwd15"
    },
    {
        "username": "user16",
        "password": "pwd16"
    }
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username=== username && user.password ===password)
    });
    if (validusers.length>0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (!username || !password) {
        return res.status(404).json({message:"Error logging in"});
    }

    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data: password
        },'access',{expiresIn: 5000*5000});

        req.session.authorization = {
            accessToken, username
    }

    return res.status(200).send("User succesfully logged in");

    } else {
        return res.status(208).json({message:"Invalid login.Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    if (!req.session.authorization) {
        return res.status(400).send("Please Login");
    }

    let book = books[req.params['isbn']];
    const newReview = req.body.review;
    const user = req.session.authorization.username;

    currentReviews = book.reviews[user];
    if (!currentReviews) {
        currentReviews = [];
    }
    currentReviews.push(newReview);
    book.reviews[user] = currentReviews;
    return res.status(200).send(book.reviews);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    if (!req.session.authorization) {
        return res.status(400).send("Please Login");
    }
    const user = req.session.authorization.username;
    let book = books[req.params['isbn']];
    actualReviews = book.reviews;
    const newReviews = Object.keys(actualReviews).reduce((object,key) => {
        if (key!= user) {
            object[key] = actualReviews[key]
        }
        return res.status(200).send(object)
    }, {})    //.reduce((obj,key)=> {
    //    obj[key] = actualReviews[key];
    //return res.status(200).send(obj);
    //}
});
  

regd_users.get("/users", (req,res)=> {
    res.send(users);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
