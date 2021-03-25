var express = require("express");
const { render } = require("../app");
var router = express.Router();
var { Book } = require("../models");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.redirect("/books");
});
//gets books in library/log
router.get("/books", function (req, res, next) {
  Book.findAll()
    .then((books) => {
      console.log(books);
      //render books page and pass the books data
      res.render("books", { books: books });
    })
    .catch((error) => {
      console.log(error);
      next();
    });
});
//gets new book
router.get("/books/new", function (req, res, next) {
  res.render("new-book");
});
//updates new book information
router.post("/books/new", function (req, res, next) {
  Book.create({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    year: req.body.year,
  })
    .then((book) => {
      console.log(book);
      res.redirect("/books");
    })
    .catch((error) => {
      console.log(error);
      res.render("new-book", {
        errors: error.errors,
      });
    });
});
//updates books' information
router.get("/books/:id", function (req, res, next) {
  Book.findAll({
    where: {
      id: req.params.id,
    },
  })
    .then((book) => {
      console.log(book);
      if (book.length) {
        res.render("update-book", { book: book[0] });
      } else {
        res.render("page-not-found");
      }
    })
    .catch((error) => {
      next();
    });
});
//posts books information
router.post("/books/:id", function (req, res, next) {
  Book.findByPk(req.params.id)
    .then((book) => {
      book
        .update({
          title: req.body.title,
          author: req.body.author,
          genre: req.body.genre,
          year: req.body.year,
        })
        .then((book) => {
          res.redirect("/books");
        })
        .catch((error) => {
          console.log(error);
          res.render("update-book", {
            book: book,
            errors: error.errors,
          });
        });
    })
    .catch((error) => {
      console.log(error);
      next();
    });
});
//deletes books
router.post("/books/:id/delete", function (req, res, next) {
  console.log(req.params);
  Book.findByPk(req.params.id)
    .then((book) => {
      book
        .destroy()
        .then((book) => {
          res.redirect("/books");
        })
        .catch((error) => {
          console.log(error);
          next();
        });
    })
    .catch((error) => {
      console.log(error);
      next();
    });
});
module.exports = router;
