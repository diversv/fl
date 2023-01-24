const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userWithSameName = users.filter((user)=>{
        return user.username ===username
    });
    if (userWithSameName.length>0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if(!doesExist(username)){
            users.push({"username":username, "password":password});
            return res.status(200).json({message:"User succesfully registered."});
        } else {
            return res.status(404).json({message:"User already exists"});
        }
    }
    return res.status(404).json({message:"Unable to register user"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let myPromise1 = new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(`Promise "Getting list of books" resolved`)
        },100)})

    myPromise1.then((succesMessage)=>{
        console.log(succesMessage);
        res.send(books)
    })
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let myPromise2 = new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(`Promise "Getting book details based on ISBN" resolved`)
        },100)})
    
    myPromise2.then((succesMessage)=>{
        console.log(succesMessage);
        let book = books[req.params['isbn']];
        res.send(book);     
    })
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let myPromise3 = new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(`Promise "Getting the book details based on author" resolved`)
        },100)})
    myPromise3.then((succesMessage)=>{
        console.log(succesMessage);
        let filtered_books = Object.values(books);
        let author = req.params.author;
        filtered_books=filtered_books.filter((book) =>book.author ===author);
        res.send(filtered_books);     
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let myPromise4 = new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(`Promise "Getting the book details based on title" resolved`)
        },100)})
    myPromise4.then((succesMessage)=>{
        console.log(succesMessage);
        let filtered_books_2 = Object.values(books);
        let title = req.params.title;
        filtered_books_2=filtered_books_2.filter((book) =>book.title === title);
        res.send(filtered_books_2); 
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let book = books[req.params['isbn']];
    res.send(book.reviews); 
});

module.exports.general = public_users;
