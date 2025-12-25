const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password} = req.body;
  if(username && password) {
      if(!isValid(users)) {
        users.push({username: username, password: password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
  } else {
    return res.status(404).json({message: "Unable to register user."});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  // res.send(JSON.stringify( books, null, 4));
  res.json(books);
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];

  if(book) {
    res.send(book);
  } else {
    res.status(404).json({message: "Book is ot found"});
  }
  // return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  let author = req.params.author;
  console.log(author);

  let keys = Object.keys(books);
  const result = keys
    .filter((key) => books[key].author.toLowerCase() === author.toLowerCase())
    .map((key) => books[key]);

  console.log("result: ",result);

  if(result.length > 0) {
    res.send(result);
  } else {
    return res.status(404).json({message: "Author not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let result = null;

  let values = Object.values(books);

  result = values.filter((book) => book.title.toLowerCase().includes(title.toLowerCase()));
  
  if(result.length > 0) {
    res.send(result);
  } else {
    return res.status(404).json({message: "Title is ot found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;

  if(!books[isbn]) {
    return res.status(404).json( { message: "ISBN is not found"});
  } else {
    let reviews = books[isbn].reviews;
    res.send(reviews);
  }

  return res.status(404).json( { message: "ISBN is not found"});
});

module.exports.general = public_users;
