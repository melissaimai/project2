// const express = require('express');
const router = require("express").Router();
const Notes = require("../models/Notes.model");

const moment = require("moment");

//middleware
const { isLoggedIn } = require("../middleware/route-guard.js");

// Landing Page
router.get("/", (req, res, next) => {
  res.render("index");
});

//Dashboard
router.get("/dashboard", isLoggedIn, (req, res, next) => {
  res.render("initial");
});

// Get single note detail
router.get("/notes/:id/detail", isLoggedIn, (req, res) => {
  const { id } = req.params;
  Notes.findById(id)
    .then((notefromDB) => {
      res.render("notes/detail-note", {
        note: notefromDB,
      });
    })
    .catch((error) => {
      console.error("Error while retrieving note details: ", error);
    });
});

// View & Update single Note
router.get("/notes/:id/edit", isLoggedIn, (req, res) => {
  const { id } = req.params;
  Notes.findById(id)
    .then((theNote) => {
      res.render("notes/edit-note", { note: theNote });
    })
    .catch((error) => {
      console.error("Error while retrieving note details: ", error);
    });
});

router.post("/notes/:id/edit", (req, res, next) => {
  const { id } = req.params;
  const { title, description, checkbox } = req.body;

  let taskDone = checkbox ? true : false

  Notes.findByIdAndUpdate(
    id,
    { title, description, taskDone },
    { new: true }
  )
    .then((updatedNote) => {
      updatedNote.save();
    })
    .then(() => res.redirect("/dashboard"))
    .catch((error) => next(error));
});

//create note
router.post("/notes/create", isLoggedIn, (req, res, next) => {
  const { title, description, date } = req.body;

  Notes.create({
    title,
    description,
    date: new Date(moment(date).format("YYYY-MM-DD")),
    owner: req.session.User._id,
  })
    .then(() => {
      res.sendStatus(201);
    })
    .catch((error) => {
      next(error);
    });
});

//list all notes
router.get('/dashboard', isLoggedIn, (req, res, next) => {
  const query = {}

  Notes.find(query)
    .populate("owner")
    .then((notes) => {
      res.render("initial", { notes });
    })
    .catch((error) => {
      next(error);
    });
});

//
router.get("/notes/:date/:ownerId", isLoggedIn, (req, res) => {
  const { date, ownerId } = req.params;
  Notes.find({
    date: new Date(moment(date).format("YYYY-MM-DD")),
    owner: ownerId,
  })
    .then((notes) => {
      return res.json({ data: notes });
    })
    .catch((error) => {
      console.error(error);
    });
});

//Delete a note
router.post("/notes/:noteId/delete", (req, res) => {
  const { noteId } = req.params;
  Notes.findByIdAndRemove(noteId)
    .then(() => res.redirect("/dashboard"))
    .catch((error) => {
      console.error("Error while deleting a note from the DB: ", error);
    });
});

module.exports = router;
