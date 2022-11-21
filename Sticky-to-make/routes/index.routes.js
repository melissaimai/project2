// const express = require('express');
const router = require("express").Router();
const Notes = require('../models/Notes.model')

const moment = require('moment')

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
// Get single note detail
router.get("/notes/:id/detail", (req, res) => {
  const { id } = req.params;
  Notes.findById(id)
    .then((notefromDB) => {
      res.render("notes/detail-note", {
        note: notefromDB
      });
    })
    .catch((error) => {
      console.log("Error while retrieving note details: ", error);
    });
});

// View & Update single Note
router.get("/notes/:id/edit", (req, res) => {
  const { id } = req.params;
  Notes.findById(id)
    .then((theNote) => {
      res.render("notes/edit-note", { note: theNote });
    })
    .catch((error) => {
      console.log("Error while retrieving note details: ", error);
    });
});
router.post("/notes/:id/edit", (req, res, next) => {
  const { id} = req.params;
  const { title, description} = req.body;

  Notes.findByIdAndUpdate(
    id,
    { title, description},
    { new: true }
  )
    .then((updatedNote) => {
      updatedNote.save();
    })
    .then(() => res.redirect("/dashboard"))
    .catch((error) => next(error));
});



router.post('/initial', (req, res, next) => {
  const { title, description, date } = req.body
  // const userId = req.session.user._id
  Notes.create({ title, description, date: new Date(moment(date).format("YYYY-MM-DD")) })
    .then(() => {
      res.sendStatus(201)
    })
    .catch(err => {
      next(err)
    })
});

//list all notes
router.get('/initial', (req, res, next) => {
  const query = {}

  Notes.find(query)
    .populate("owner")
    .then(notes => {
      res.render('initial', { notes })
    })
    .catch(err => {
      next(err)
    })
});

router.get('/notes/:date', (req, res) => {
  const { date } = req.params
  Notes.find({ date: new Date(moment(date).format("YYYY-MM-DD")) })
    .then(notes => {
      return res.json({ data: notes })
    })
    .catch(err => {
      console.log(err)
    })
});



module.exports = router;
