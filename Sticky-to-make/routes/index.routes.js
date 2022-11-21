// const express = require('express');
const router = require("express").Router();
const Notes = require('../models/Notes.model')

/* GET home page */
// router.get("/", (req, res, next) => {
//   res.render("index");
// });

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/dashboard", (req, res, next) => {
  res.render("initial");
});

router.get("/notes/create", (req, res, next) => {
  res.render("notes/new-note");
});
router.get("/notes/detail", (req, res, next) => {
  res.render("notes/detail-note");
});

router.post('/initial', (req, res, next) => {
  const { title, description } = req.body
  // const userId = req.session.user._id
  Notes.create({ title, description })
    .then(createdNote => {
      res.redirect('/initial')
    })
    .catch(err => {
      next(err)
    })
});

//list all notes
router.get('/initial', (req, res, next) => {
  // const userId = req.session.user._id
  const query = {}
  Notes.find(query)
    .populate("owner")
    .then(notes => {
      console.log("notes: ", notes)
      res.render('initial', { notes })
    })
    .catch(err => {
      next(err)
    })
});


module.exports = router;
